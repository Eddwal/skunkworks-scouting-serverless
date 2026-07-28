'use server'

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { adminAuth } from '@/lib/firebase/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export async function importTbaEvent(eventKey: string, clientToken?: string) {
  const headersList = await headers();
  const token = clientToken || headersList.get('Authorization')?.split('Bearer ')[1];
  if (!token) throw new Error("Unauthorized");
  
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (err: any) {
    throw new Error(`Auth verification failed: ${err.message}. Are you running the Firebase Emulator?`); // I wonder why I needed to add this in... ;)
  }
  if (!decodedToken.admin) throw new Error("Forbidden: Only users with admin claim may update events");

  const tbaHeaders = { 
    'X-TBA-Auth-Key': process.env.TBA_API_KEY!,
    'Accept': 'application/json',
    'User-Agent': 'skunkworks-scouting/1.0'
  };
  
  const fetchOpts: RequestInit = { headers: tbaHeaders, cache: 'no-store' };

  const [eventRes, matchesRes, teamsRes] = await Promise.all([
    fetch(`${TBA_BASE_URL}/event/${eventKey}/simple`, fetchOpts),
    fetch(`${TBA_BASE_URL}/event/${eventKey}/matches/simple`, fetchOpts),
    fetch(`${TBA_BASE_URL}/event/${eventKey}/teams/simple`, fetchOpts)
  ]);

  if (!eventRes.ok || !matchesRes.ok || !teamsRes.ok) {
    throw new Error(`Failed to fetch data from The Blue Alliance: ${eventRes.status} ${matchesRes.status} ${teamsRes.status}`);
  }

  const eventText = await eventRes.text();
  const matchesText = await matchesRes.text();
  const teamsText = await teamsRes.text();
  let eventData, matchesData, teamsData;
  try {
    eventData = JSON.parse(eventText);
    matchesData = JSON.parse(matchesText);
    teamsData = JSON.parse(teamsText);
  } catch (err: any) {
    console.error("Failed to parse JSON.");
    console.error("eventText (first 100 chars):", eventText.slice(0, 100));
    console.error("matchesText (first 100 chars):", matchesText.slice(0, 100));
    console.error("teamsText (first 100 chars):", teamsText.slice(0, 100));
    throw new Error(`JSON parse error: ${err.message}. EventTextLength: ${eventText.length}, MatchesTextLength: ${matchesText.length}`);
  }

  const db = getFirestore();
  const batch = db.batch();

  const uniqueTeams = new Set<string>();
  matchesData.forEach((match: any) => {
    match.alliances.red.team_keys.forEach((team: string) => uniqueTeams.add(team.replace('frc', '')));
    match.alliances.blue.team_keys.forEach((team: string) => uniqueTeams.add(team.replace('frc', '')));
  });
  const teams = Array.from(uniqueTeams);

  const eventRef = db.collection('events').doc(eventKey);
  batch.set(eventRef, {
    name: eventData.name,
    startDate: eventData.start_date,
    endDate: eventData.end_date,
    city: eventData.city,
    teams: teams,
    importedAt: new Date().toISOString(),
    importedBy: decodedToken.uid,
  }, { merge: true });

  matchesData.forEach((match: any) => {
    const matchRef = eventRef.collection('matches').doc(match.key);
    
    batch.set(matchRef, {
      matchKey: match.key,
      compLevel: match.comp_level,
      matchNumber: match.match_number,
      setNumber: match.set_number,
      time: match.time, // Unix timestamp
      redTeams: match.alliances.red.team_keys.map((t: string) => t.replace('frc', '')),
      blueTeams: match.alliances.blue.team_keys.map((t: string) => t.replace('frc', '')),
    }, { merge: true });
  });

  teamsData.forEach((team: any) => {
    const teamNumber = team.key.replace('frc', '');
    const teamRef = eventRef.collection('teams').doc(teamNumber);
    batch.set(teamRef, {
      name: team.name,
      nickname: team.nickname,
      eventId: eventKey,
      teamId: teamNumber,
      year: eventKey.substring(0, 4)
    }, { merge: true });
  });

  try {
    await batch.commit();
    revalidateTag('events', 'max');
    revalidatePath('/', 'layout');
  } catch (err: any) {
    throw new Error(`Firestore commit failed: ${err.message}. Are you running the Firebase Emulator?`);
  }

  return { success: true, message: `Imported ${eventData.name} and ${matchesData.length} matches.` };
}