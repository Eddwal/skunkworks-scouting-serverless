'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import { unstable_cache } from 'next/cache';

export interface ScoutLeaderboardEntry {
  id: string;
  name: string;
  matchCount: number;
}

export async function getScoutLeaderboard(eventId: string): Promise<ScoutLeaderboardEntry[]> {
  if (!eventId) return [];

  const fetchStats = unstable_cache(
    async () => {
      const snapshot = await adminDb
        .collection('events')
        .doc(eventId)
        .collection('scoutStats')
        .orderBy('matchCount', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown Scout',
        matchCount: doc.data().matchCount || 0,
      }));
    },
    [`scoutStats-${eventId}`],
    {
      tags: [`scoutStats-${eventId}`],
      revalidate: 3600
    }
  );

  return fetchStats();
}
