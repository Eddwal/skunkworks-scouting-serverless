import { adminDb } from '@/lib/firebase/firebase-admin';
import { EventProvider, ScoutingEvent } from '@/hooks/use-event';
import { GlobalNav } from '@/components/global-nav';
import { Suspense } from 'react';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const eventsSnapshot = await adminDb.collection('events').orderBy('startDate', 'desc').get();
  
  const events: ScoutingEvent[] = eventsSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    teams: doc.data().teams || [],
    city: doc.data().city,
    startDate: doc.data().startDate,
    endDate: doc.data().endDate
  }));

  return (
    <Suspense fallback={<div className="flex h-svh w-full items-center justify-center">Loading...</div>}>
      <EventProvider initialEvents={events}>
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
