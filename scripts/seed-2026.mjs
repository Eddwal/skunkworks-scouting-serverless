import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser to get the project ID
const envPath = path.join(__dirname, '..', '.env');
let projectId = 'skunkworks-scouting'; // Fallback
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    if (line.includes('=')) {
      const [key, ...rest] = line.split('=');
      if (key === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') {
        let val = rest.join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        projectId = val;
      }
    }
  }
}

// Force the use of the emulator
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

initializeApp({
  projectId: projectId,
});

const db = getFirestore();
const eventId = '2026demo';
const year = '2026';

// 2026 Analytics Processor
function processAnalytics(currentAnalytics, matchData) {
  const matchCount = currentAnalytics.matchCount; 
  
  const autoFuel = matchData.auto?.fuelScored || 0;
  const teleopFuel = matchData.teleop?.fuelScored || 0;
  const overallFuel = autoFuel + teleopFuel;
  
  const autoMoved = matchData.auto?.moved ? 1 : 0;
  const autoDied = matchData.auto?.died ? 1 : 0;

  currentAnalytics.totalAutoFuelScored = (currentAnalytics.totalAutoFuelScored || 0) + autoFuel;
  currentAnalytics.totalTeleopFuelScored = (currentAnalytics.totalTeleopFuelScored || 0) + teleopFuel;
  currentAnalytics.totalOverallFuelScored = (currentAnalytics.totalOverallFuelScored || 0) + overallFuel;
  currentAnalytics.totalMatchesAutoMoved = (currentAnalytics.totalMatchesAutoMoved || 0) + autoMoved;
  currentAnalytics.totalMatchesAutoDied = (currentAnalytics.totalMatchesAutoDied || 0) + autoDied;

  if (matchCount > 0) {
    currentAnalytics.avgAutoFuelScored = (currentAnalytics.totalAutoFuelScored || 0) / matchCount;
    currentAnalytics.avgTeleopFuelScored = (currentAnalytics.totalTeleopFuelScored || 0) / matchCount;
    currentAnalytics.avgOverallFuelScored = (currentAnalytics.totalOverallFuelScored || 0) / matchCount;
    currentAnalytics.autoMovedPercentage = ((currentAnalytics.totalMatchesAutoMoved || 0) / matchCount) * 100;
    currentAnalytics.autoDiedPercentage = ((currentAnalytics.totalMatchesAutoDied || 0) / matchCount) * 100;
  }

  return currentAnalytics;
}

function calculateMatchPoints(matchData) {
  const autoPoints = matchData.auto?.fuelScored || 0;
  const teleopPoints = matchData.teleop?.fuelScored || 0;
  const endgamePoints = 0;

  return {
    matchKey: matchData.matchSetup?.matchKey || '',
    auto: autoPoints,
    teleop: teleopPoints,
    endgame: endgamePoints,
    total: autoPoints + teleopPoints + endgamePoints
  };
}

async function uploadMatchScoutData(data) {
  const dbTeamId = data.teamId;
  const matchKey = data.matchSetup?.matchKey;

  const fullMatchDocRef = db.collection('events').doc(eventId).collection('matches').doc(matchKey);
  const teamDocRef = db.collection('events').doc(eventId).collection('teams').doc(dbTeamId);
  
  await db.runTransaction(async (transaction) => {
    const teamDoc = await transaction.get(teamDocRef);
    const currentData = teamDoc.data() || {};
    
    transaction.set(fullMatchDocRef, {
      [dbTeamId]: {
        ...data,
        teamId: dbTeamId,
        year,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });

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

    let finalAnalytics = processAnalytics(analytics, data);
    
    if (!finalAnalytics.matchHistory) {
      finalAnalytics.matchHistory = [];
    }
    const matchPoints = calculateMatchPoints(data);
    finalAnalytics.matchHistory.push({
      ...matchPoints,
      matchKey: matchPoints.matchKey || matchKey
    });

    transaction.set(teamDocRef, { analytics: finalAnalytics }, { merge: true });
  });
}

async function seedData() {
  const eventDocRef = db.collection('events').doc(eventId);
  
  await eventDocRef.set({
    id: eventId,
    name: '2026 Demo Event',
    teams: ['1983', '254', '2910', '2046', '1318', '4911'],
    city: 'Seattle',
    startDate: '2026-03-01',
    endDate: '2026-03-03',
    game: '2026'
  }, { merge: true });
  
  const demoMatches = [
    {
      id: `${eventId}_qm1`,
      matchKey: `${eventId}_qm1`,
      compLevel: 'qm',
      matchNumber: 1,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 3600,
      redTeams: ['1983', '254', '2910'],
      blueTeams: ['2046', '1318', '4911']
    },
    {
      id: `${eventId}_qm2`,
      matchKey: `${eventId}_qm2`,
      compLevel: 'qm',
      matchNumber: 2,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 7200,
      redTeams: ['2910', '2046', '1318'],
      blueTeams: ['1983', '254', '4911']
    },
    {
      id: `${eventId}_qm3`,
      matchKey: `${eventId}_qm3`,
      compLevel: 'qm',
      matchNumber: 3,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 10800,
      redTeams: ['2046', '1318', '1983'],
      blueTeams: ['2910', '254', '4911']
    }
  ];

  const matchesRef = eventDocRef.collection('matches');
  for (const match of demoMatches) {
    await matchesRef.doc(match.id).set(match, { merge: true });
    console.log(`Added match metadata ${match.id}`);
  }

  console.log(`Seeding mock match scout data for year ${year}...`);
  for (const match of demoMatches) {
    const allTeams = [...match.redTeams, ...match.blueTeams];
    for (const team of allTeams) {
      // 80% chance to move in auto
      const autoMoved = Math.random() < 0.8;
      // 15% chance to die in auto
      const autoDied = Math.random() < 0.15;
      // 10% chance to die in teleop
      const teleopDead = Math.random() < 0.1;

      const data = {
        eventId: eventId,
        teamId: team,
        year: year,
        matchSetup: {
          matchKey: match.id,
          scheduledTeamId: team,
          isSubstitute: false,
          noShow: false
        },
        auto: {
          moved: autoMoved,
          died: autoDied,
          majorFouls: 0,
          minorFouls: Math.floor(Math.random() * 2),

          fuelScored: Math.floor(Math.random() * 20)
        },
        teleop: {
          majorFouls: 0,
          minorFouls: Math.floor(Math.random() * 3),
          died: teleopDead,
          fuelScored: Math.floor(Math.random() * 50)
        },
        endgame: {
          yellowCard: false,
          redCard: false,
          notes: 'Test mock match data'
        }
      };

      await uploadMatchScoutData(data);
      console.log(`Seeded match ${match.id} for team ${team}`);
    }
  }

  console.log('Successfully added mock match scouting data to the local Firestore emulator!');
}

seedData().catch(console.error);
