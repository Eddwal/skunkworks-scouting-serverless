import 'server-only';
import { EventProvider, ScoutingEvent } from '@/hooks/use-event';
import { ScoutsProvider } from '@/hooks/use-scouts';
import { ScoutData } from '@/app/actions/scouts';
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
  { tags: ['events'], revalidate: false }
);

const getCachedScouts = unstable_cache(
  async () => {
    const scoutsSnapshot = await adminDb.collection('scouts').orderBy('name', 'asc').get();
    return scoutsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      createdAt: doc.data().createdAt,
    }));
  },
  ['all-scouts'],
  { tags: ['scouts'], revalidate: false }
);

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialEvents: ScoutingEvent[] = [];
  let initialScouts: ScoutData[] = [];
  try {
    initialEvents = await getCachedEvents() as ScoutingEvent[];
  } catch (error) {
    console.error('Error fetching events on server:', error);
  }
  
  try {
    initialScouts = await getCachedScouts() as ScoutData[];
  } catch (error) {
    console.error('Error fetching scouts on server:', error);
  }

  return (
    <Suspense fallback={<div className="flex h-svh w-full items-center justify-center">Loading...</div>}>
      <ScoutsProvider initialScouts={initialScouts}>
        <EventProvider initialEvents={initialEvents}>
          <div className="flex min-h-svh flex-col bg-background">
            <GlobalNav />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </EventProvider>
      </ScoutsProvider>
    </Suspense>
  );
}
