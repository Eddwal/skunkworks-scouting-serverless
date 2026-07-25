import { Suspense } from 'react';
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
  const eventId = resolvedParams.event || '';
  const initialTeam = resolvedParams.team || '';

  return (
    <Suspense fallback={<div className="p-4">Loading Team Viewer...</div>}>
      <TeamViewerClient 
        initialTeam={initialTeam}
        serverEventId={eventId}
      />
    </Suspense>
  );
}
