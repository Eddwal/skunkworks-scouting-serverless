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

const eventId = '2025reefscapedemo';
const eventName = '2025 Reefscape Demo Event';
const teams = ['1983', '254', '2910', '2046', '1318', '4911', '4414', '1678'];

function generateRandomMatchHistory(teamId) {
  const history = [];
  // Generate 10 matches of trend data
  for (let i = 1; i <= 10; i++) {
    // Make the data somewhat realistic and varied
    const baseAuto = Math.floor(Math.random() * 15) + 5;
    const baseTeleop = Math.floor(Math.random() * 30) + 10;
    const baseEndgame = Math.random() > 0.3 ? 12 : 2; // e.g. climbed or not

    // Add a slight upward trend over time
    const trend = i * 1.5;

    history.push({
      matchKey: `${eventId}_qm${i}`,
      auto: Math.round(baseAuto + (trend * 0.5)),
      teleop: Math.round(baseTeleop + trend),
      endgame: baseEndgame,
      total: Math.round(baseAuto + baseTeleop + baseEndgame + (trend * 1.5))
    });
  }
  return history;
}

async function seedReefscape() {
  const eventDocRef = db.collection('events').doc(eventId);
  
  await eventDocRef.set({
    id: eventId,
    name: eventName,
    teams: teams,
    city: 'Seattle',
    startDate: '2025-03-01',
    endDate: '2025-03-03',
    game: '2025'
  });
  
  console.log(`Added event ${eventId} ("${eventName}")`);

  const matchesRef = eventDocRef.collection('matches');
  
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
      blueTeams: ['4414', '1678', '4911']
    }
  ];
  
  for (const match of demoMatches) {
    await matchesRef.doc(match.id).set(match);
    console.log(`Added match ${match.id}`);
  }

  const teamsRef = eventDocRef.collection('teams');
  
  for (const teamId of teams) {
    const history = generateRandomMatchHistory(teamId);
    
    // Calculate averages for standings
    const autoPoints = history.reduce((sum, match) => sum + match.auto, 0) / history.length;
    const teleopPoints = history.reduce((sum, match) => sum + match.teleop, 0) / history.length;
    const endgamePoints = history.reduce((sum, match) => sum + match.endgame, 0) / history.length;

    const l1w = Math.random();
    const l2w = Math.random();
    const l3w = Math.random();
    const l4w = Math.random();
    const sumW = l1w + l2w + l3w + l4w;
    
    const w1 = l1w / sumW;
    const w2 = l2w / sumW;
    const w3 = l3w / sumW;
    const w4 = l4w / sumW;

    const teamData = {
      analytics: {
        matchCount: 10,
        uptime: { autoDeadCount: 0, teleopDeadCount: Math.random() > 0.8 ? 1 : 0 },
        fouls: { major: Math.random() > 0.8 ? 1 : 0, minor: Math.floor(Math.random() * 3), yellowCards: 0, redCards: 0 },
        notes: [],
        matchHistory: history,
        // 2025 Reefscape specific metrics with random weights
        avgAutoCoralL4: autoPoints * w4,
        avgAutoCoralL3: autoPoints * w3,
        avgAutoCoralL2: autoPoints * w2,
        avgAutoCoralL1: autoPoints * w1,
        avgTeleopCoralL4: teleopPoints * w4,
        avgTeleopCoralL3: teleopPoints * w3,
        avgTeleopCoralL2: teleopPoints * w2,
        avgTeleopCoralL1: teleopPoints * w1,
        avgOverallCoralL4: (autoPoints + teleopPoints) * w4,
        avgOverallCoralL3: (autoPoints + teleopPoints) * w3,
        avgOverallCoralL2: (autoPoints + teleopPoints) * w2,
        avgOverallCoralL1: (autoPoints + teleopPoints) * w1,
        totalDeepClimbs: Math.floor(Math.random() * 8),
        totalShallowClimbs: Math.floor(Math.random() * 4),
      },
      robot: {
        weight: 120,
        length: 28,
        width: 28,
        driveType: 'Swerve',
        driveMotor: 'Kraken'
      },
      capabilities: {
        coralL4: { can: Math.random() > 0.2, auto: Math.random() > 0.5 },
        coralL3: { can: Math.random() > 0.1, auto: Math.random() > 0.5 },
        coralL2: { can: true, auto: Math.random() > 0.3 },
        coralL1: { can: true, auto: true },
        deepClimb: { can: Math.random() > 0.6 },
        shallowClimb: { can: Math.random() > 0.2 },
        autoDescription: "Can score consistently and leave the starting zone.",
        notes: "Solid overall performance, swerve drive looks very robust."
      }
    };

    await teamsRef.doc(teamId).set(teamData);
    console.log(`Seeded team data for ${teamId}`);
  }
  
  console.log('Successfully seeded Reefscape demo data to the local Firestore emulator!');
}

seedReefscape().catch(console.error);
