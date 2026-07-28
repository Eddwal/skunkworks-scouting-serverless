'use client';

import { useMemo } from 'react';
import { useEvent } from '@/hooks/use-event';
import { getGameConfig, DEFAULT_YEAR } from '@/lib/games';
import { TeamData } from '@/lib/firebase/converters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function StandingsClient({
  initialTeams,
  serverEventId
}: {
  initialTeams: (TeamData & { id: string })[];
  serverEventId: string;
}) {
  const { activeEvent } = useEvent();
  
  // If no activeEvent is set in the client, but we have a serverEventId, we could use that.
  // However, useEvent hook typically synchronizes. We will rely on activeEvent.
  const eventToUse = activeEvent || (serverEventId ? { id: serverEventId, name: 'Loading...' } : null);
  
  const year = eventToUse?.id ? eventToUse.id.substring(0, 4) : DEFAULT_YEAR;
  const gameConfig = getGameConfig(year);
  const standingsConfig = gameConfig.standings;

  const chartConfig = {
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
  };

  const dataKeys = ['auto', 'teleop', 'endgame'];

  const chartData = useMemo(() => {
    if (!standingsConfig) return [];
    return standingsConfig.calculateStandings(initialTeams);
  }, [initialTeams, standingsConfig]);

  if (!eventToUse) {
    return (
      <div className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div>Select an event to view standings.</div>
        </div>
      </div>
    );
  }

  if (!standingsConfig) {
    return (
      <div className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-destructive">Standings are not configured for {gameConfig.name} ({year}).</div>
        </div>
      </div>
    );
  }

  const formatYAxis = (teamId: string) => {
    const team = chartData.find(d => d.teamId === teamId);
    if (!team) return teamId;
    return `${team.rank}. ${team.teamId}`;
  };

  const chartHeight = Math.max(400, chartData.length * 40 + 100);

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Standings</h2>
          <p className="text-muted-foreground">{eventToUse.name}</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Rankings based on average points scored per match</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div style={{ height: chartHeight }} className="w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart 
                    accessibilityLayer 
                    data={chartData} 
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis 
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      dataKey="teamId" 
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={formatYAxis}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    
                    {dataKeys.map((key, index) => {
                      const isFirst = index === 0;
                      const isLast = index === dataKeys.length - 1;
                      const radius: [number, number, number, number] = isFirst && isLast ? [4, 4, 4, 4] :
                                     isLast ? [0, 4, 4, 0] : 
                                     isFirst ? [4, 0, 0, 4] : [0, 0, 0, 0];
                                     
                      return (
                        <Bar 
                          key={key} 
                          dataKey={key} 
                          stackId="a" 
                          fill={`var(--color-${key})`} 
                          radius={radius}
                        />
                      );
                    })}
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                No team data available for this event.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
