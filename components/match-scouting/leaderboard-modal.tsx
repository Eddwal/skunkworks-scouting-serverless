'use client';

import { useState, useEffect } from 'react';
import { useEvent } from '@/hooks/use-event';
import { getScoutLeaderboard, ScoutLeaderboardEntry } from '@/app/actions/scout-stats';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy } from '@phosphor-icons/react';

export function LeaderboardModal() {
  const { activeEvent } = useEvent();
  const [open, setOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ScoutLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && activeEvent) {
      setLoading(true);
      getScoutLeaderboard(activeEvent.id)
        .then(data => {
          setLeaderboard(data);
        })
        .catch(err => {
          console.error("Failed to load leaderboard", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={
        <Button variant="outline" className="gap-2">
          <Trophy className="w-4 h-4" />
          Leaderboard
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scouting Leaderboard</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!activeEvent ? (
            <p className="text-muted-foreground text-center">No event selected.</p>
          ) : loading ? (
            <p className="text-muted-foreground text-center animate-pulse">Loading rankings...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-muted-foreground text-center">No matches scouted yet!</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((scout, index) => (
                <div 
                  key={scout.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    index === 0 ? 'bg-primary/10 border-primary/20' :
                    index === 1 ? 'bg-muted/50' :
                    index === 2 ? 'bg-muted/30' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 text-center ${
                      index === 0 ? 'text-primary text-lg' : 'text-muted-foreground'
                    }`}>
                      {index + 1}.
                    </span>
                    <span className={index === 0 ? 'font-semibold text-primary' : 'font-medium'}>
                      {scout.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {scout.matchCount} {scout.matchCount === 1 ? 'match' : 'matches'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
