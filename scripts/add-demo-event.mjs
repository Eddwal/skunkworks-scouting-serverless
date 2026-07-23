import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
let year = '2026';
let eventName = 'Demo Skunkworks Event';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--year' && args[i+1]) {
    year = args[i+1];
    i++;
  } else if (args[i] === '--name' && args[i+1]) {
    eventName = args[i+1];
    i++;
  } else if (!args[i].startsWith('--')) {
    // positional arguments fallback
    if (i === 0) year = args[i];
    if (i === 1) eventName = args[i];
  }
}

const eventId = `${year}demo`;

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

async function addDemoEvent() {
  const eventDocRef = db.collection('events').doc(eventId);
  
  await eventDocRef.set({
    id: eventId,
    name: eventName,
    teams: ['frc1983', 'frc254', 'frc2910', 'frc2046', 'frc1318', 'frc4911'],
    city: 'Seattle',
    startDate: `${year}-03-01`,
    endDate: `${year}-03-03`
  });
  
  console.log(`Added event ${eventId} ("${eventName}") for year ${year}`);

  const matchesRef = eventDocRef.collection('matches');
  
  const demoMatches = [
    {
      id: `${eventId}_qm1`,
      matchKey: `${eventId}_qm1`,
      compLevel: 'qm',
      matchNumber: 1,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 3600,
      redTeams: ['frc1983', 'frc254', 'frc2910'],
      blueTeams: ['frc2046', 'frc1318', 'frc4911']
    },
    {
      id: `${eventId}_qm2`,
      matchKey: `${eventId}_qm2`,
      compLevel: 'qm',
      matchNumber: 2,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 7200,
      redTeams: ['frc2910', 'frc2046', 'frc1318'],
      blueTeams: ['frc1983', 'frc254', 'frc4911']
    },
    {
      id: `${eventId}_qm3`,
      matchKey: `${eventId}_qm3`,
      compLevel: 'qm',
      matchNumber: 3,
      setNumber: 1,
      time: Math.floor(Date.now() / 1000) + 10800,
      redTeams: ['frc2046', 'frc1318', 'frc1983'],
      blueTeams: ['frc2910', 'frc254', 'frc4911']
    }
  ];
  
  for (const match of demoMatches) {
    await matchesRef.doc(match.id).set(match);
    console.log(`Added match ${match.id}`);
  }
  
  console.log('Successfully added demo event and matches to the local Firestore emulator!');
}

addDemoEvent().catch(console.error);
