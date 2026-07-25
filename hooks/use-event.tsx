'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { db } from '@/lib/firebase/firebase-client';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface ScoutingEvent {
  id: string;
  name: string;
  teams: string[];
  city?: string;
  startDate?: string;
  endDate?: string;
}

interface EventContextType {
  events: ScoutingEvent[];
  activeEvent: ScoutingEvent | null;
  setActiveEvent: (eventId: string) => void;
}

const EventContext = createContext<EventContextType>({
  events: [],
  activeEvent: null,
  setActiveEvent: () => {},
});

export function EventProvider({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [events, setEvents] = useState<ScoutingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const eventIdParam = searchParams.get('event');
  
  const [activeEvent, setActiveEventState] = useState<ScoutingEvent | null>(null);

  // Fetch events from Firestore on client
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('startDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents: ScoutingEvent[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        teams: doc.data().teams || [],
        city: doc.data().city,
        startDate: doc.data().startDate,
        endDate: doc.data().endDate
      }));
      setEvents(fetchedEvents);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Sync state on load and URL changes
  useEffect(() => {
    if (loading) return; // Wait until events are fetched

    let currentEventId = eventIdParam;
    
    // If no event in URL, try to get from localStorage
    if (!currentEventId) {
      const savedEventId = localStorage.getItem('skunkworks_active_event');
      if (savedEventId && events.find(e => e.id === savedEventId)) {
        currentEventId = savedEventId;
      } else if (events.length > 0) {
        // Fallback to first event if none in localstorage
        currentEventId = events[0].id;
      }
    }
    
    // Update active state
    if (currentEventId) {
      const eventObj = events.find(e => e.id === currentEventId) || null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveEventState(eventObj);
      if (eventObj) {
        localStorage.setItem('skunkworks_active_event', eventObj.id);
      }
      
      // If URL doesn't match, update it
      if (eventIdParam !== currentEventId) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('event', currentEventId);
        // Using replace to not pollute browser history
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [eventIdParam, events, pathname, router, searchParams, loading]);

  const setActiveEvent = (eventId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('event', eventId);
    localStorage.setItem('skunkworks_active_event', eventId);
    // Push a new history entry when explicitly changing
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading) {
    return <div className="flex h-svh w-full items-center justify-center">Loading events...</div>;
  }

  return (
    <EventContext.Provider value={{ events, activeEvent, setActiveEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
