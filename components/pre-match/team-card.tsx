"use client"

import { useState } from "react"
import { TeamData } from "@/lib/firebase/converters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WrenchIcon, TrendUpIcon, WarningIcon } from "@phosphor-icons/react"

interface TeamCardProps {
  teamNum: string
  teamData?: TeamData
  allTeams: Record<string, TeamData>
  onTeamChange: (newTeamNum: string) => void
  alliance: "red" | "blue"
}

export function TeamCard({ teamNum, teamData, allTeams, onTeamChange, alliance }: TeamCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const borderColor = alliance === "red" ? "border-red-500/20" : "border-blue-500/20"
  const bgColor = alliance === "red" ? "bg-red-500/10" : "bg-blue-500/10"
  
  const allTeamNumbers = Object.keys(allTeams).sort((a, b) => parseInt(a) - parseInt(b))

  return (
    <Card className={`overflow-hidden ${borderColor} ${bgColor}`}>
      <CardContent className="p-4 flex flex-col h-full justify-between gap-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="text-sm font-semibold">Select Team</div>
            <Select value={teamNum} onValueChange={(val) => {
              onTeamChange(val || "")
              setIsEditing(false)
            }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">Empty</SelectItem>
                {allTeamNumbers.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-start justify-between">
                <div className="font-bold text-xl">{teamNum ? `Team ${teamNum}` : "Empty"}</div>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setIsEditing(true)}>
                  Swap
                </Button>
              </div>
              
              {teamNum && !teamData && (
                <div className="text-sm text-muted-foreground mt-2">
                  No data available.
                </div>
              )}

              {teamData && (
                <div className="mt-4 space-y-2 text-sm">
                  {/* Basic Stats Display */}
                  <div className="flex items-center gap-2">
                    <TrendUpIcon className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Matches:</span>
                    <span className="font-medium">{teamData.analytics?.matchCount || 0}</span>
                  </div>
                  
                  {teamData.analytics?.totalOverallCoralL4 !== undefined && (
                     <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300">L4</div>
                      <span className="text-muted-foreground">Avg L4:</span>
                      <span className="font-medium">
                        {teamData.analytics.avgOverallCoralL4?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  )}

                  {teamData.analytics?.totalOverallCoralL3 !== undefined && (
                     <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">L3</div>
                      <span className="text-muted-foreground">Avg L3:</span>
                      <span className="font-medium">
                        {teamData.analytics.avgOverallCoralL3?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  )}
                  
                  {teamData.analytics?.fouls && teamData.analytics.fouls.major > 0 && (
                     <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mt-2 pt-2 border-t border-border/50">
                      <WarningIcon className="size-4" />
                      <span>{teamData.analytics.fouls.major} Major Fouls</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {teamData?.capabilities && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <WrenchIcon className="size-3" />
                <span>Pit data available</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
