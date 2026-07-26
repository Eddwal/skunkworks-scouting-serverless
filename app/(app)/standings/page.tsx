import { Suspense } from 'react';
import StandingsClient from './standings-client';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { TeamData } from '@/lib/firebase/converters';
import { unstable_cache } from 'next/cache';

const getCachedTeams = unstable_cache(
  async (eventId: string) => {
    const teamsSnapshot = await adminDb.collection('events').doc(eventId).collection('teams').get();
    const fetchedTeams = teamsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (TeamData & { id: string })[];
    
    // Sort numerically initially
    fetchedTeams.sort((a, b) => parseInt(a.id.replace('frc', '')) - parseInt(b.id.replace('frc', '')));
    return fetchedTeams;
  },
  ['teams-for-event'],
  { tags: ['events', 'standings'] } // Added standings tag here
);

export const metadata = {
  title: 'Standings',
  description: 'Leaderboard of all teams',
};

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const resolvedParams = await searchParams;
  const eventId = resolvedParams.event || '';

  let initialTeams: (TeamData & { id: string })[] = [];

  if (eventId) {
    try {
      initialTeams = await getCachedTeams(eventId);
    } catch (error) {
      console.error('Error fetching teams on server:', error);
    }
  }

  return (
    <Suspense fallback={<div className="p-4">Loading Standings...</div>}>
      <StandingsClient 
        initialTeams={initialTeams}
        serverEventId={eventId}
      />
    </Suspense>
  );
}
