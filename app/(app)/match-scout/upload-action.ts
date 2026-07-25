import { db } from '@/lib/firebase/firebase-client';
import { doc, runTransaction } from 'firebase/firestore';
import { getGameConfig } from '@/lib/games';
import { MatchData } from '@/lib/firebase/converters';

export async function uploadMatchScoutData(data: MatchData) {
  const eventId = data.eventId;
  const dbTeamId = data.teamId;
  const year = data.year;
  
  if (!eventId || !dbTeamId || !year) {
    throw new Error("Missing required upload data (eventId, teamId, or year)");
  }
  
  const matchKey = data.matchSetup?.matchKey;
  if (!matchKey) {
    throw new Error("Missing matchKey in matchSetup");
  }

  const fullMatchDocRef = doc(db, 'events', eventId, 'matches', matchKey);
  const teamDocRef = doc(db, 'events', eventId, 'teams', dbTeamId);
  
  await runTransaction(db, async (transaction) => {
    // Reads must happen before writes
    const teamDoc = await transaction.get(teamDocRef);
    const currentData = teamDoc.data() || {};
    
    // Write the individual match log to the aggregated match document
    transaction.set(fullMatchDocRef, {
      [dbTeamId]: {
        ...data,
        teamId: dbTeamId,
        year,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });

    // Update team analytics
    const analytics = currentData.analytics || {
      matchCount: 0,
      uptime: { autoDeadCount: 0, teleopDeadCount: 0 },
      fouls: { major: 0, minor: 0, yellowCards: 0, redCards: 0 },
      notes: []
    };

    if (analytics.fouls.yellowCards === undefined) analytics.fouls.yellowCards = 0;
    if (analytics.fouls.redCards === undefined) analytics.fouls.redCards = 0;

    analytics.matchCount += 1;

    const autoDead = data.auto?.deadInTheWater === true;
    const teleopDead = data.teleop?.deadInTheWater === true;
    if (autoDead) analytics.uptime.autoDeadCount += 1;
    if (teleopDead) analytics.uptime.teleopDeadCount += 1;

    const autoMajor = Number(data.auto?.majorFouls) || 0;
    const autoMinor = Number(data.auto?.minorFouls) || 0;
    const teleopMajor = Number(data.teleop?.majorFouls) || 0;
    const teleopMinor = Number(data.teleop?.minorFouls) || 0;

    analytics.fouls.major += autoMajor + teleopMajor;
    analytics.fouls.minor += autoMinor + teleopMinor;

    if (data.endgame?.yellowCard) analytics.fouls.yellowCards += 1;
    if (data.endgame?.redCard) analytics.fouls.redCards += 1;

    const endgameNotes = data.endgame?.notes;
    if (endgameNotes && endgameNotes.trim().length > 0) {
      analytics.notes.push({
        title: matchKey,
        content: endgameNotes.trim()
      });
    }

    // Apply year-specific analytics logic if defined
    const gameConfig = getGameConfig(year);
    let finalAnalytics = analytics;
    if (gameConfig.matchScout?.processAnalytics) {
      finalAnalytics = gameConfig.matchScout.processAnalytics(finalAnalytics, data);
    }

    // Update the team document with the new analytics
    transaction.set(teamDocRef, { analytics: finalAnalytics }, { merge: true });
  });
  
  // Trigger cache invalidation for the Team Viewer dashboard
  try {
    const { revalidateTeamViewer } = await import('@/app/actions/revalidate');
    await revalidateTeamViewer();
  } catch (error) {
    console.error('Failed to trigger revalidation:', error);
  }
}
