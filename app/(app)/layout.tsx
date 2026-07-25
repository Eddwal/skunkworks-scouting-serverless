import { EventProvider } from '@/hooks/use-event';
import { GlobalNav } from '@/components/global-nav';
import { Suspense } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-svh w-full items-center justify-center">Loading...</div>}>
      <EventProvider>
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
