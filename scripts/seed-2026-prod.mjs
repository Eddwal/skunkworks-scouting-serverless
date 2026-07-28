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

// We are NOT using the emulator. This will write to PRODUCTION.
console.warn("⚠️ WARNING: SEEDING TO PRODUCTION FIRESTORE! ⚠️");

initializeApp({
  projectId: projectId,
});

const db = getFirestore();

const eventId = '2026rebuiltdemo';
const eventName = '2026 Rebuilt Demo Event';
const teams = ['1983', '254', '2910', '2046', '1318', '4911', '4414', '1678'];

function generateRandomMatchHistory(teamId) {
  const history = [];
  // Generate 10 matches of trend data
  for (let i = 1; i <= 10; i++) {
    // Make the data somewhat realistic and varied
    const baseAuto = Math.floor(Math.random() * 41) + 10; // 10 to 50
    const baseTeleop = Math.floor(Math.random() * 86) + 15; // 15 to 100
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

async function seed2026() {
  const eventDocRef = db.collection('events').doc(eventId);
  
  await eventDocRef.set({
    id: eventId,
    name: eventName,
    teams: teams,
    city: 'Seattle',
    startDate: '2026-03-01',
    endDate: '2026-03-03',
    game: '2026'
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
    
    const teamData = {
      analytics: {
        matchCount: 10,
        uptime: { autoDeadCount: 0, teleopDeadCount: Math.random() > 0.8 ? 1 : 0 },
        fouls: { major: Math.random() > 0.8 ? 1 : 0, minor: Math.floor(Math.random() * 3), yellowCards: 0, redCards: 0 },
        notes: [],
        matchHistory: history,
        // 2026 Specific Metrics
        avgAutoFuelScored: autoPoints * 1.5,
        avgTeleopFuelScored: teleopPoints * 2,
        avgOverallFuelScored: (autoPoints * 1.5) + (teleopPoints * 2),
        totalAutoFuelScored: autoPoints * 1.5 * 10,
        totalTeleopFuelScored: teleopPoints * 2 * 10,
        totalOverallFuelScored: ((autoPoints * 1.5) + (teleopPoints * 2)) * 10
      },
      robot: {
        weight: 120,
        length: 28,
        width: 28,
        driveType: 'Swerve',
        driveMotor: 'Kraken',
        hopperCapacity: Math.floor(Math.random() * 50) + 20
      },
      capabilities: {
        movement: {
          move: { can: true, auto: true },
          trench: { can: Math.random() > 0.3, auto: Math.random() > 0.7 },
          bump: { can: Math.random() > 0.5, auto: false }
        },
        shooting: {
          shoot: { can: true, auto: Math.random() > 0.2 }
        },
        collection: {
          floor: { can: true, auto: true },
          depot: { can: Math.random() > 0.4, auto: false },
          chute: { can: Math.random() > 0.8, auto: false }
        },
        climbing: {
          maxLevel: ['No Climb', 'Level 1', 'Level 2', 'Level 3'][Math.floor(Math.random() * 4)],
          autoClimb: Math.random() > 0.8
        },
        autoDescription: "Can score consistently and leave the starting zone.",
        notes: "Solid overall performance, swerve drive looks very robust."
      }
    };

    await teamsRef.doc(teamId).set(teamData);
    console.log(`Seeded team data for ${teamId}`);
  }
  
  console.log('Successfully seeded 2026 Rebuilt demo data to PRODUCTION!');
}

seed2026().catch(console.error);
