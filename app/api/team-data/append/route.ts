import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { getGameConfig } from '@/lib/games';
import { withAuth } from '@/lib/firebase/api-auth';

export const POST = withAuth(async (req: NextRequest, token) => {
  const body = await req.json();
  const { eventId, teamId, year, data } = body;
  
  if (!eventId || !teamId || !year || !data) {
    return NextResponse.json({ error: 'Missing required fields (eventId, teamId, year, data)' }, { status: 400 });
  }

  const gameConfig = getGameConfig(year);
  if (gameConfig.api?.teamAppendSchema) {
    const parseResult = gameConfig.api.teamAppendSchema.safeParse(data);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data payload', details: parseResult.error }, { status: 400 });
    }
  }

  const teamDocRef = adminDb.collection('events').doc(eventId).collection('teams').doc(teamId);
  const teamDoc = await teamDocRef.get();
  
  if (!teamDoc.exists) {
    return NextResponse.json({ error: 'Team document not found' }, { status: 404 });
  }

  await teamDocRef.set(data, { merge: true });

  return NextResponse.json({ success: true, message: 'Team data appended successfully' });
});
