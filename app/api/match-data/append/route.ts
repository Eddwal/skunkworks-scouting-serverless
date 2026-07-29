import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { getGameConfig } from '@/lib/games';
import { withAuth } from '@/lib/firebase/api-auth';

export const POST = withAuth(async (req: NextRequest, token) => {
  const body = await req.json();
  const { eventId, matchId, year, data } = body;
  
  if (!eventId || !matchId || !year || !data) {
    return NextResponse.json({ error: 'Missing required fields (eventId, matchId, year, data)' }, { status: 400 });
  }

  const gameConfig = getGameConfig(year);
  if (gameConfig.api?.matchAppendSchema) {
    const parseResult = gameConfig.api.matchAppendSchema.safeParse(data);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data payload', details: parseResult.error }, { status: 400 });
    }
  }

  const matchDocRef = adminDb.collection('events').doc(eventId).collection('matches').doc(matchId);
  const matchDoc = await matchDocRef.get();
  
  if (!matchDoc.exists) {
    return NextResponse.json({ error: 'Match document not found' }, { status: 404 });
  }

  await matchDocRef.set(data, { merge: true });

  return NextResponse.json({ success: true, message: 'Match data appended successfully' });
});
