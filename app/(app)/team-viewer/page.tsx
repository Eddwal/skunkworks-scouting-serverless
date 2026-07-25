import { Suspense } from 'react';
import { adminDb } from '@/lib/firebase/firebase-admin';
import TeamViewerClient from './team-viewer-client';

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
  const eventId = resolvedParams.event;
  const initialTeam = resolvedParams.team || '';

  if (!eventId) {
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <TeamViewerClient 
          initialTeams={[]} 
          initialTeam={initialTeam}
          serverEventId=""
        />
      </Suspense>
    );
  }

  let fetchedTeams: any[] = [];
  try {
    const teamsSnapshot = await adminDb.collection('events').doc(eventId).collection('teams').get();
    
    fetchedTeams = teamsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort numerically
    fetchedTeams.sort((a, b) => parseInt(a.id.replace('frc', '')) - parseInt(b.id.replace('frc', '')));
  } catch (error) {
    console.error('Error fetching teams from Admin SDK:', error);
  }

  return (
    <Suspense fallback={<div className="p-4">Loading Team Viewer...</div>}>
      <TeamViewerClient 
        initialTeams={fetchedTeams} 
        initialTeam={initialTeam}
        serverEventId={eventId}
      />
    </Suspense>
  );
}
