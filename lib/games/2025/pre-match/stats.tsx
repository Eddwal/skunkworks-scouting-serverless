import { TeamData } from "@/lib/firebase/converters"
import { StatWithRank } from "@/components/ui/stat-with-rank"
import { AnalyticsData2025 } from "../schemas"

function getRankValues(allTeams: Record<string, TeamData>, extractor: (a: AnalyticsData2025) => number | undefined) {
  return Object.values(allTeams)
    .map(t => {
      const a = t.analytics as AnalyticsData2025 | undefined
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

export function ReefscapeStats({ teamData, allTeams }: { teamData?: TeamData; allTeams: Record<string, TeamData> }) {
  const analytics = teamData?.analytics as AnalyticsData2025 | undefined

  if (!teamData) return null

  const getAutoCoral = (a: AnalyticsData2025) => a.matchCount ? (a.avgAutoCoralL1 || 0) + (a.avgAutoCoralL2 || 0) + (a.avgAutoCoralL3 || 0) + (a.avgAutoCoralL4 || 0) : undefined
  const getTeleopCoral = (a: AnalyticsData2025) => a.matchCount ? (a.avgTeleopCoralL1 || 0) + (a.avgTeleopCoralL2 || 0) + (a.avgTeleopCoralL3 || 0) + (a.avgTeleopCoralL4 || 0) : undefined
  const getDeepClimbs = (a: AnalyticsData2025) => a.totalDeepClimbs !== undefined ? a.totalDeepClimbs : (a.matchCount ? 0 : undefined)
  const getShallowClimbs = (a: AnalyticsData2025) => a.totalShallowClimbs !== undefined ? a.totalShallowClimbs : (a.matchCount ? 0 : undefined)

  return (
    <div className="grid grid-cols-4 gap-3">
      <SmallStat label="Auto Coral" value={analytics ? getAutoCoral(analytics) : undefined} allValues={getRankValues(allTeams, getAutoCoral)} fractionDigits={1} />
      <SmallStat label="Teleop Coral" value={analytics ? getTeleopCoral(analytics) : undefined} allValues={getRankValues(allTeams, getTeleopCoral)} fractionDigits={1} />
      <SmallStat label="Deep Climbs" value={analytics ? getDeepClimbs(analytics) : undefined} allValues={getRankValues(allTeams, getDeepClimbs)} />
      <SmallStat label="Shallow Climbs" value={analytics ? getShallowClimbs(analytics) : undefined} allValues={getRankValues(allTeams, getShallowClimbs)} />
    </div>
  )
}
