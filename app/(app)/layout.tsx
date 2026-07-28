import 'server-only';
import { EventProvider, ScoutingEvent } from '@/hooks/use-event';
import { GlobalNav } from '@/components/global-nav';
import { Suspense } from 'react';
import { adminDb } from '@/lib/firebase/firebase-admin';

import { unstable_cache } from 'next/cache';

const getCachedEvents = unstable_cache(
  async () => {
    const eventsSnapshot = await adminDb.collection('events').orderBy('startDate', 'desc').get();
    return eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        teams: data.teams || [],
        city: data.city,
        startDate: data.startDate,
        endDate: data.endDate
      };
    });
  },
  ['all-events'],
  { tags: ['events'], revalidate: 300 }
);

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialEvents: ScoutingEvent[] = [];
  try {
    initialEvents = await getCachedEvents() as ScoutingEvent[];
  } catch (error) {
    console.error('Error fetching events on server:', error);
  }

  return (
    <Suspense fallback={<div className="flex h-svh w-full items-center justify-center">Loading...</div>}>
      <EventProvider initialEvents={initialEvents}>
        <div className="flex min-h-svh flex-col bg-background">
          <GlobalNav />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </EventProvider>
    </Suspense>
  );
}
