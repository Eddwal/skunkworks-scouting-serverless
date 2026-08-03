'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

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
  initialEvents = []
}: { 
  children: React.ReactNode;
  initialEvents?: ScoutingEvent[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const eventIdParam = searchParams.get('event');
  
  const [activeEvent, setActiveEventState] = useState<ScoutingEvent | null>(null);

  // Sync state on load and URL changes
  useEffect(() => {
    let currentEventId = eventIdParam;
    
    // If no event in URL, try to get from localStorage
    if (!currentEventId) {
      const savedEventId = localStorage.getItem('skunkworks_active_event');
      if (savedEventId && initialEvents.find(e => e.id === savedEventId)) {
        currentEventId = savedEventId;
      } else if (initialEvents.length > 0) {
        // Fallback to first event if none in localstorage
        currentEventId = initialEvents[0].id;
      }
    }
    
    // Update active state
    if (currentEventId) {
      const eventObj = initialEvents.find(e => e.id === currentEventId) || null;
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
  }, [eventIdParam, initialEvents, pathname, router, searchParams]);

  const setActiveEvent = (eventId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('event', eventId);
    localStorage.setItem('skunkworks_active_event', eventId);
    // Push a new history entry when explicitly changing
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <EventContext.Provider value={{ events: initialEvents, activeEvent, setActiveEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
