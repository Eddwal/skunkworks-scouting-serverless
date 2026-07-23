'use client';

import { useState, useEffect } from 'react';
import { useEvent } from '@/hooks/use-event';
import { db } from '@/lib/firebase/firebase-client';
import { collection, getDocs } from 'firebase/firestore';
import { getGameConfig } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleNotch, ArrowSquareOut } from '@phosphor-icons/react';

export default function TeamViewerPage() {
  const { activeEvent } = useEvent();
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeEvent) return;
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const pitScoutRef = collection(db, 'events', activeEvent.id, 'pitScout');
        const snapshot = await getDocs(pitScoutRef);
        const fetchedTeams = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort teams numerically
        fetchedTeams.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        
        setTeams(fetchedTeams);
        if (fetchedTeams.length > 0 && !selectedTeam) {
          setSelectedTeam(fetchedTeams[0].id);
        }
      } catch (e) {
        console.error("Error fetching teams", e);
      }
      setLoading(false);
    };
    fetchTeams();
  }, [activeEvent]); // Removed selectedTeam from deps to avoid re-running

  if (!activeEvent) {
    return <div className="p-4">Please select an event in the navigation bar.</div>;
  }

  const gameConfig = getGameConfig(activeEvent.id.substring(0, 4));
  const teamData = teams.find(t => t.id === selectedTeam);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Top Bar for Team Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">Select Team:</h2>
          {loading ? (
            <div className="flex items-center text-muted-foreground"><CircleNotch className="mr-2 h-4 w-4 animate-spin" /></div>
          ) : (
            <div className="w-64">
              <Select value={selectedTeam} onValueChange={(val) => { if (val) setSelectedTeam(val); }}>
                <SelectTrigger>
                  <span data-slot="select-value" className="flex flex-1 text-left">
                    {selectedTeam ? selectedTeam.replace('frc', '') : 'Select a Team'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.id.replace('frc', '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {teamData && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="shrink-0" nativeButton={false} render={<a href={`https://www.thebluealliance.com/team/${selectedTeam.replace('frc', '')}`} target="_blank" rel="noreferrer" />}>
              TBA <ArrowSquareOut className="ml-1.5 size-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="shrink-0" nativeButton={false} render={<a href={`https://statbotics.io/team/${selectedTeam.replace('frc', '')}`} target="_blank" rel="noreferrer" />}>
              Statbotics <ArrowSquareOut className="ml-1.5 size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {teamData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Robot Specs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                      <p className="font-medium">{teamData.robot?.weight ?? 'N/A'} lbs</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Dimensions</p>
                      <p className="font-medium">{teamData.robot?.length ?? '?'} x {teamData.robot?.width ?? '?'} in</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Drivetrain</p>
                      <p className="font-medium capitalize">{teamData.robot?.driveType ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Motors</p>
                      <p className="font-medium capitalize">{teamData.robot?.driveMotor ?? 'N/A'}</p>
                    </div>
                  </div>
                  {gameConfig.pitScout.RobotViewerComponent && (
                    <div className="pt-4 border-t">
                      <gameConfig.pitScout.RobotViewerComponent data={teamData.robot} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Photo */}
              <Card className="shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Robot Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 pb-6 px-6">
                  {teamData.photoUrl ? (
                    <Dialog>
                      <DialogTrigger
                        nativeButton={false}
                        render={
                          <div className="relative rounded-md overflow-hidden bg-muted flex items-center justify-center border h-full min-h-[200px] cursor-pointer hover:opacity-90 transition-opacity">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={teamData.photoUrl} alt={`Team ${teamData.id} Robot`} className="object-cover w-full h-full absolute inset-0" />
                          </div>
                        }
                      />
                      <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={teamData.photoUrl} alt={`Team ${teamData.id} Robot`} className="w-full h-auto object-contain max-h-[85vh] rounded-md" />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="rounded-md bg-muted flex items-center justify-center text-muted-foreground border h-full min-h-[200px]">
                      No Photo Available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Year Specific Capabilities */}
            <Card className="shadow-sm border-primary/20">
              <CardHeader className="bg-primary/5 border-b pb-4">
                <CardTitle className="text-lg">Capabilities</CardTitle>
                <CardDescription>Pit scouted data specific to {gameConfig.name}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {gameConfig.pitScout.CapabilitiesViewerComponent ? (
                  <gameConfig.pitScout.CapabilitiesViewerComponent data={teamData.capabilities} />
                ) : (
                  <p className="text-muted-foreground">No capabilities viewer defined for this year.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground bg-muted/30">
            {teams.length === 0 ? 'No pit scout data found for this event.' : 'Select a team to view their data.'}
          </div>
        )}
      </div>
    </div>
  );
}
