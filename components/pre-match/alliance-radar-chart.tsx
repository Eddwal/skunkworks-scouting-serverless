"use client"

import { TeamData } from "@/lib/firebase/converters"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from "react"

import { GameConfig } from "@/lib/games/types"

interface AllianceRadarChartProps {
  teams: string[]
  teamsData: Record<string, TeamData>
  alliance: "red" | "blue"
  gameConfig?: GameConfig
}

export function AllianceRadarChart({ teams, teamsData, alliance, gameConfig }: AllianceRadarChartProps) {
  // Generate chart data based on game config metrics
  const chartData = useMemo(() => {
    const metrics = gameConfig?.preMatch?.radarMetrics || []

    const metricMaxes: Record<string, number> = {}
    metrics.forEach(m => {
      let max = 0
      Object.values(teamsData).forEach(team => {
        const val = team?.analytics?.[m.key] || 0
        if (val > max) max = val
      })
      metricMaxes[m.key] = max > 0 ? max : 1
    })

    return metrics.map(m => {
      const row: any = { metric: m.label }
      teams.forEach((t, i) => {
        if (t && teamsData[t]?.analytics) {
          const raw = teamsData[t].analytics[m.key] || 0
          row[`team${i+1}`] = (raw / metricMaxes[m.key]) * 100
          row[`team${i+1}_raw`] = raw
        } else {
          row[`team${i+1}`] = 0
          row[`team${i+1}_raw`] = 0
        }
      })
      return row
    })
  }, [teams, teamsData, gameConfig])

  // Chart config defines colors and labels for the tooltip and legend
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    
    // Define base colors based on alliance (distinct hues within the alliance family)
    const colors = alliance === "red" 
      ? ["hsl(0 100% 55%)", "hsl(330 100% 60%)", "hsl(25 100% 55%)"] // Red, Pink, Orange
      : ["hsl(220 100% 55%)", "hsl(190 100% 50%)", "hsl(270 100% 65%)"] // Blue, Cyan, Purple

    teams.forEach((t, i) => {
      const key = `team${i+1}`
      config[key] = {
        label: t ? `Team ${t}` : `Empty Slot ${i+1}`,
        color: colors[i % colors.length]
      }
    })
    
    return config
  }, [teams, alliance])

  const isEmpty = teams.every(t => !t || !teamsData[t])

  if (isEmpty) {
    return (
      <Card className={`border-${alliance}-500/20 bg-${alliance}-500/5`}>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg">
            No data available for these teams.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={alliance === "red" ? "border-red-500/20 bg-red-500/5" : "border-blue-500/20 bg-blue-500/5"}>
      <CardContent className="pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData} margin={{ right: 10, bottom: 20, left: 10 }} outerRadius="65%">
            <ChartLegend className="mt-2" content={<ChartLegendContent />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            {teams.map((t, i) => {
              if (!t) return null
              const dataKey = `team${i+1}`
              const color = chartConfig[dataKey]?.color || "currentColor"
              return (
                <Radar
                  key={dataKey}
                  name={chartConfig[dataKey]?.label as string}
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2.5}
                  fill={color}
                  fillOpacity={0.25}
                />
              )
            })}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
