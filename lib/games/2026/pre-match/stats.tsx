'use client';

import { TeamData } from "@/lib/firebase/converters"
import { StatWithRank } from "@/components/ui/stat-with-rank"
import { AnalyticsData2026 } from "../match-scout/schema"

function getRankValues(allTeams: Record<string, TeamData>, extractor: (a: AnalyticsData2026) => number | undefined) {
  return Object.values(allTeams)
    .map(t => {
      const a = t.analytics as AnalyticsData2026 | undefined
      if (!a) return undefined
      return extractor(a)
    })
    .filter((v): v is number => v !== undefined)
}

function SmallStat({ label, value, allValues, fractionDigits }: { label: string, value: number | undefined, allValues: number[], fractionDigits?: number }) {
  return (
    <div className="[&>div]:p-2 [&>div]:gap-0 [&>div>div:first-child]:text-xl [&>div>div:nth-child(2)]:text-xs">
      <StatWithRank label={label} value={value} allValues={allValues} fractionDigits={fractionDigits} />
    </div>
  )
}

export function RebuiltStats({ teamData, allTeams }: { teamData?: TeamData; allTeams: Record<string, TeamData> }) {
  const analytics = teamData?.analytics as AnalyticsData2026 | undefined

  if (!teamData) return null

  const getAutoFuel = (a: AnalyticsData2026) => a.avgAutoFuelScored
  const getTeleopFuel = (a: AnalyticsData2026) => a.avgTeleopFuelScored

  return (
    <div className="grid grid-cols-2 gap-3">
      <SmallStat label="Auto Fuel" value={analytics ? getAutoFuel(analytics) : undefined} allValues={getRankValues(allTeams, getAutoFuel)} fractionDigits={1} />
      <SmallStat label="Teleop Fuel" value={analytics ? getTeleopFuel(analytics) : undefined} allValues={getRankValues(allTeams, getTeleopFuel)} fractionDigits={1} />
    </div>
  )
}
