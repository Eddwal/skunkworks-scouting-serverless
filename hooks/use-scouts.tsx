'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ScoutData } from '@/app/actions/scouts';

interface ScoutsContextType {
  scouts: ScoutData[];
  activeScout: ScoutData | null;
  setActiveScout: (scoutId: string) => void;
}

const ScoutsContext = createContext<ScoutsContextType>({
  scouts: [],
  activeScout: null,
  setActiveScout: () => {},
});

export function ScoutsProvider({ 
  children,
  initialScouts = []
}: { 
  children: React.ReactNode;
  initialScouts?: ScoutData[];
}) {
  const [scouts] = useState<ScoutData[]>(initialScouts);
  const [activeScoutId, setActiveScoutId] = useState<string | null>(null);

  // Sync state on load
  useEffect(() => {
    const savedScoutId = localStorage.getItem('skunkworks_active_scout');
    if (savedScoutId) {
      setActiveScoutId(savedScoutId);
    }
  }, []);

  const activeScout = scouts.find(s => s.id === activeScoutId) || null;

  const setActiveScout = (scoutId: string) => {
    const scoutObj = scouts.find(s => s.id === scoutId) || null;
    if (scoutObj) {
      setActiveScoutId(scoutId);
      localStorage.setItem('skunkworks_active_scout', scoutId);
    } else {
      setActiveScoutId(null);
      localStorage.removeItem('skunkworks_active_scout');
    }
  };

  return (
    <ScoutsContext.Provider value={{ scouts, activeScout, setActiveScout }}>
      {children}
    </ScoutsContext.Provider>
  );
}

export function useScouts() {
  return useContext(ScoutsContext);
}
