'use server';

import 'server-only';
import { adminDb, adminAuth } from '@/lib/firebase/firebase-admin';
import { getGameConfig } from '@/lib/games';
import { MatchData } from '@/lib/firebase/converters';

export async function uploadMatchScoutData(data: MatchData, clientToken?: string) {
  if (!clientToken) {
    throw new Error("Unauthorized: Missing auth token");
  }

  try {
    await adminAuth.verifyIdToken(clientToken);
  } catch (err: any) {
    throw new Error(`Auth verification failed: ${err.message}`);
  }
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

  const fullMatchDocRef = adminDb.collection('events').doc(eventId).collection('matches').doc(matchKey);
  const teamDocRef = adminDb.collection('events').doc(eventId).collection('teams').doc(dbTeamId);
  
  await adminDb.runTransaction(async (transaction) => {
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

    const autoDead = data.auto?.died === true;
    const teleopDead = data.teleop?.died === true;
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
    
    // Compute and append match points (for scoring over time chart)
    if (gameConfig.calculateMatchPoints) {
      if (!finalAnalytics.matchHistory) {
        finalAnalytics.matchHistory = [];
      }
      const matchPoints = gameConfig.calculateMatchPoints(data);
      // Ensure matchKey is present in case it's not set by calculateMatchPoints
      finalAnalytics.matchHistory.push({
        ...matchPoints,
        matchKey: matchPoints.matchKey || matchKey
      });
    }

    // Update the team document with the new analytics
    transaction.set(teamDocRef, { analytics: finalAnalytics }, { merge: true });
  });
  
  // Trigger cache invalidation for the Team Viewer and Standings dashboard
  try {
    const { revalidateDashboards } = await import('@/app/actions/revalidate');
    await revalidateDashboards();
  } catch (error) {
    console.error('Failed to trigger revalidation:', error);
  }
}
