import 'server-only';
import { Suspense } from 'react';
import TeamViewerClient from './team-viewer-client';
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
    
    // Sort numerically
    fetchedTeams.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    return fetchedTeams;
  },
  ['teams-for-event'],
  { tags: ['events'], revalidate: 31536000 }
);

export const metadata = {
  title: 'Team Viewer',
  description: 'Analyze team performance',
};

export default async function TeamViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; team?: string }>;
}) {
  const resolvedParams = await searchParams;
  const eventId = resolvedParams.event || '';
  const initialTeam = resolvedParams.team || '';

  let initialTeams: (TeamData & { id: string })[] = [];

  if (eventId) {
    try {
      initialTeams = await getCachedTeams(eventId);
    } catch (error) {
      console.error('Error fetching teams on server:', error);
    }
  }

  return (
    <Suspense fallback={<div className="p-4">Loading Team Viewer...</div>}>
      <TeamViewerClient 
        initialTeams={initialTeams}
        initialTeam={initialTeam}
        serverEventId={eventId}
      />
    </Suspense>
  );
}
