'use server'

import { headers } from 'next/headers';
import { adminAuth } from '@/lib/firebase/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export async function fetchEventTeamsFromTba(eventKey: string, clientToken?: string) {
  const headersList = await headers();
  const token = clientToken || headersList.get('Authorization')?.split('Bearer ')[1];
  if (!token) throw new Error("Unauthorized");
  
  try {
    await adminAuth.verifyIdToken(token);
  } catch (err: any) {
    throw new Error(`Auth verification failed.`);
  }
  
  const tbaHeaders = { 
    'X-TBA-Auth-Key': process.env.TBA_API_KEY!,
    'Accept': 'application/json',
    'User-Agent': 'skunkworks-scouting/1.0'
  };
  
  const fetchOpts: RequestInit = { headers: tbaHeaders, cache: 'no-store' };

  const res = await fetch(`${TBA_BASE_URL}/event/${eventKey}/teams/simple`, fetchOpts);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch teams from TBA: ${res.status}`);
  }

  const teamsData = await res.json();
  
  const db = getFirestore();
  const batch = db.batch();
  
  teamsData.forEach((team: any) => {
    const teamNumber = team.key.replace('frc', '');
    const teamRef = db.collection('events').doc(eventKey).collection('teams').doc(teamNumber);
    
    // Merge true so we don't overwrite existing scouting data
    batch.set(teamRef, {
      name: team.name,
      nickname: team.nickname,
      eventId: eventKey,
      teamId: teamNumber,
      year: eventKey.substring(0, 4)
    }, { merge: true });
  });

  await batch.commit();
  return { success: true };
}
