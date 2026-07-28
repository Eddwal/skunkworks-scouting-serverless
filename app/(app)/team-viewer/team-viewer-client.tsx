'use client';

import { useState, useEffect } from 'react';
import { useEvent } from '@/hooks/use-event';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getGameConfig } from '@/lib/games';
import { TeamData } from '@/lib/firebase/converters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleNotchIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function TeamViewerClient({
  initialTeams,
  initialTeam,
  serverEventId
}: {
  initialTeams: (TeamData & { id: string })[];
  initialTeam: string;
  serverEventId: string;
}) {
  const { activeEvent } = useEvent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // We use serverEventId or activeEvent.id to ensure the client stays in sync
  const currentEventId = serverEventId || activeEvent?.id;
  
  const [selectedTeam, setSelectedTeam] = useState<string>(initialTeam);

  const handleTeamChange = (val: string) => {
    setSelectedTeam(val);
    const params = new URLSearchParams(searchParams.toString());
    params.set('team', val);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // If we have teams but no selected team, default to the first one
    if (initialTeams.length > 0) {
      if (!selectedTeam || !initialTeams.some(t => t.id === selectedTeam)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleTeamChange(initialTeams[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTeams]);

  if (!currentEventId) {
    return (
      <div className="p-4 flex items-center">
        <CircleNotchIcon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Loading event...</span>
      </div>
    );
  }

  const gameConfig = getGameConfig(currentEventId.substring(0, 4));
  const teamData = initialTeams.find(t => t.id === selectedTeam);

  // Compute rankings
  let autoUptimeRank = 0;
  let teleopUptimeRank = 0;
  let totalAutoRanks = 0;
  let totalTeleopRanks = 0;

  if (teamData?.analytics) {
    const validTeams = initialTeams.filter(t => t.analytics && t.analytics.matchCount > 0);

    if (teamData.analytics.matchCount > 0) {
      const getAutoScore = (t: TeamData) => t.analytics!.matchCount > 0 ? (1 - (t.analytics!.uptime.autoDeadCount / t.analytics!.matchCount)) : -1;
      const getTeleopScore = (t: TeamData) => t.analytics!.matchCount > 0 ? (1 - (t.analytics!.uptime.teleopDeadCount / t.analytics!.matchCount)) : -1;

      // Extract all unique scores to determine dense ranks
      const uniqueAutoScores = Array.from(new Set(validTeams.map(getAutoScore))).sort((a, b) => b - a);
      const uniqueTeleopScores = Array.from(new Set(validTeams.map(getTeleopScore))).sort((a, b) => b - a);

      totalAutoRanks = uniqueAutoScores.length;
      totalTeleopRanks = uniqueTeleopScores.length;

      const currentAutoScore = getAutoScore(teamData);
      const currentTeleopScore = getTeleopScore(teamData);

      autoUptimeRank = uniqueAutoScores.indexOf(currentAutoScore) + 1;
      teleopUptimeRank = uniqueTeleopScores.indexOf(currentTeleopScore) + 1;
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Top Bar for Team Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">Select Team:</h2>
          <div className="w-64">
            <Select value={selectedTeam} onValueChange={(val) => { if (val) handleTeamChange(val); }}>
              <SelectTrigger>
                <span data-slot="select-value" className="flex flex-1 text-left">
                  {selectedTeam ? selectedTeam : 'Select a Team'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {initialTeams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {teamData && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="shrink-0" nativeButton={false} render={<a href={`https://www.thebluealliance.com/team/${selectedTeam}`} target="_blank" rel="noreferrer" />}>
              TBA <ArrowSquareOutIcon className="ml-1.5 size-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="shrink-0" nativeButton={false} render={<a href={`https://statbotics.io/team/${selectedTeam}`} target="_blank" rel="noreferrer" />}>
              Statbotics <ArrowSquareOutIcon className="ml-1.5 size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {teamData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="flex flex-col space-y-6">
              {/* Basic Info */}
              <Card className="shadow-sm h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Robot Specs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamData.robot ? (
                    <>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                          <p className="font-medium">{teamData.robot.weight ?? 'N/A'} lbs</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Dimensions</p>
                          <p className="font-medium">{teamData.robot.length ?? '?'} x {teamData.robot.width ?? '?'} in</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Drivetrain</p>
                          <p className="font-medium capitalize">{teamData.robot.driveType ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Motors</p>
                          <p className="font-medium capitalize">{teamData.robot.driveMotor ?? 'N/A'}</p>
                        </div>
                      </div>
                      {gameConfig.pitScout.RobotViewerComponent && (
                        <gameConfig.pitScout.RobotViewerComponent data={teamData.robot} />
                      )}
                    </>
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/30 text-sm">
                      No Pit Scout Data
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Year Specific Capabilities */}
              <Card className="shadow-sm border-primary/20 h-fit overflow-hidden">
                <CardHeader className="border-b pb-2">
                  <CardTitle className="text-lg">Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  {teamData.capabilities ? (
                    gameConfig.pitScout.CapabilitiesViewerComponent ? (
                      <gameConfig.pitScout.CapabilitiesViewerComponent data={teamData.capabilities} />
                    ) : (
                      <p className="text-muted-foreground">No capabilities viewer defined for this year.</p>
                    )
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/30 text-sm">
                      No Pit Scout Data
                    </div>
                  )}
                </CardContent>
              </Card>

              {teamData.analytics?.matchHistory && teamData.analytics.matchHistory.length > 0 && (
                <Card className="shadow-sm h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Points Over Time</CardTitle>
                    <CardDescription>Performance trend across matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer config={{
                        auto: {
                          label: "Auto",
                          color: "var(--color-chart-1)",
                        },
                        teleop: {
                          label: "Teleop",
                          color: "var(--color-chart-2)",
                        },
                        endgame: {
                          label: "Endgame",
                          color: "var(--color-chart-3)",
                        }
                      }} className="h-full w-full">
                        <LineChart data={teamData.analytics.matchHistory} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="matchKey" tick={false} tickLine={false} axisLine={false} tickMargin={10} />
                          <YAxis tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line type="monotone" dataKey="auto" stroke="var(--color-auto)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="teleop" stroke="var(--color-teleop)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="endgame" stroke="var(--color-endgame)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6">
              {/* Photo */}
              <Card className="shadow-sm overflow-hidden flex flex-col h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Robot Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-3 pt-0">
                  {teamData.photoUrl ? (
                    <Dialog>
                      <DialogTrigger
                        nativeButton={false}
                        render={
                          <div className="relative rounded-md overflow-hidden bg-muted flex items-center justify-center border h-full min-h-[250px] cursor-pointer hover:opacity-90 transition-opacity">
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
                    <div className="rounded-md border bg-muted flex items-center justify-center text-muted-foreground h-full min-h-[250px]">
                      No Photo Available
                    </div>
                  )}
                </CardContent>
              </Card>

              {teamData.analytics && (
                <>
                  <Card className="shadow-sm h-fit">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Match Scouting Analytics</CardTitle>
                      <CardDescription>Aggregate data from {teamData.analytics.matchCount} matches</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-muted/50 p-3 rounded-md flex flex-col justify-center">
                          <div className="text-2xl font-bold">{teamData.analytics.matchCount > 0 ? Math.round((1 - (teamData.analytics.uptime.autoDeadCount / teamData.analytics.matchCount)) * 100) : 0}%</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Auto Uptime</div>
                          {teamData.analytics.matchCount > 0 && (
                            <div className="text-[10px] text-muted-foreground/80 font-medium">Rank {autoUptimeRank} of {totalAutoRanks}</div>
                          )}
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md flex flex-col justify-center">
                          <div className="text-2xl font-bold">{teamData.analytics.matchCount > 0 ? Math.round((1 - (teamData.analytics.uptime.teleopDeadCount / teamData.analytics.matchCount)) * 100) : 0}%</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Teleop Uptime</div>
                          {teamData.analytics.matchCount > 0 && (
                            <div className="text-[10px] text-muted-foreground/80 font-medium">Rank {teleopUptimeRank} of {totalTeleopRanks}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center pt-2">
                        <div>
                          <div className="text-xl font-semibold">{teamData.analytics.fouls.major}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Major Fouls</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{teamData.analytics.fouls.minor}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Minor Fouls</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{teamData.analytics.fouls.yellowCards || 0}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Yellow Cards</div>
                        </div>
                      </div>
                      
                      {gameConfig.matchScout?.AnalyticsViewerComponent && (
                        <div className="pt-4 border-t">
                          <gameConfig.matchScout.AnalyticsViewerComponent data={teamData.analytics} allTeamsData={initialTeams} />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </>
              )}

              <Card className="shadow-sm h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {teamData.capabilities?.autoDescription && (
                      <div className="bg-muted/30 p-3 rounded-md border">
                        <div className="font-semibold text-sm mb-1 text-primary">Pit Scout - Auto Description</div>
                        <div className="text-sm whitespace-pre-wrap">{teamData.capabilities.autoDescription}</div>
                      </div>
                    )}
                    {teamData.capabilities?.notes && (
                      <div className="bg-muted/30 p-3 rounded-md border">
                        <div className="font-semibold text-sm mb-1 text-primary">Pit Scout - Notes</div>
                        <div className="text-sm whitespace-pre-wrap">{teamData.capabilities.notes}</div>
                      </div>
                    )}
                    {teamData.analytics?.notes?.map((note, idx) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-md border">
                        <div className="font-semibold text-sm mb-1 text-primary">{note.title.toUpperCase()}</div>
                        <div className="text-sm whitespace-pre-wrap">{note.content}</div>
                      </div>
                    ))}
                    {!teamData.capabilities?.notes && !teamData.capabilities?.autoDescription && (!teamData.analytics?.notes || teamData.analytics.notes.length === 0) && (
                      <div className="text-muted-foreground text-sm text-center py-8">No notes available.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground bg-muted/30">
            {initialTeams.length === 0 ? 'No team data found for this event.' : 'Select a team to view their data.'}
          </div>
        )}
      </div>
    </div>
  );
}
