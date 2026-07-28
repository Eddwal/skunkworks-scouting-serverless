import { TeamData } from "@/lib/firebase/converters"

export function Year2027Stats({ teamData, allTeams }: { teamData?: TeamData; allTeams: Record<string, TeamData> }) {
  if (!teamData) return null;
  return (
    <div className="grid grid-cols-2 gap-3 p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
      Define 2027 specific stats here
    </div>
  )
}
