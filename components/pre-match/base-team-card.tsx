"use client"

import { useState } from "react"
import { TeamData } from "@/lib/firebase/converters"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { WrenchIcon, NoteIcon, WarningIcon, CameraIcon, ChartBarIcon } from "@phosphor-icons/react"
import { GameConfig } from "@/lib/games/types"

interface BaseTeamCardProps {
  teamNum: string
  teamData?: TeamData
  allTeams: Record<string, TeamData>
  onTeamChange: (newTeamNum: string) => void
  alliance: "red" | "blue"
  gameConfig?: GameConfig
}

export function BaseTeamCard({ teamNum, teamData, allTeams, onTeamChange, alliance, gameConfig }: BaseTeamCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const borderColor = alliance === "red" ? "border-red-500/20" : "border-blue-500/20"
  const bgColor = alliance === "red" ? "bg-red-500/10" : "bg-blue-500/10"
  
  const allTeamNumbers = Object.keys(allTeams).sort((a, b) => parseInt(a) - parseInt(b))

  const analytics = teamData?.analytics as any
  const capabilities = teamData?.capabilities as any

  return (
    <Card className={`overflow-hidden flex flex-col sm:flex-row p-4 gap-4 ${borderColor} ${bgColor}`}>
      {/* Left side: Photo */}
      <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-md overflow-hidden bg-muted/50 flex flex-col items-center justify-center border border-border/50 relative">
        {teamData?.photoUrl ? (
          <img src={teamData.photoUrl} alt={`Team ${teamNum} robot`} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/50">
            <CameraIcon className="size-8 mb-1" />
            <span className="text-xs">No Photo</span>
          </div>
        )}
      </div>

      {/* Right side: Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {isEditing ? (
          <div className="space-y-3">
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
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 truncate">
                <div className="text-2xl font-bold truncate leading-tight">{teamNum ? `Team ${teamNum}` : "Empty"}</div>
                {teamData?.nickname && (
                  <div className="text-sm text-muted-foreground font-medium truncate">{teamData.nickname}</div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs px-3 shrink-0 -mt-1 -mr-1" onClick={() => setIsEditing(true)}>
                Swap
              </Button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {teamData ? (
                <div className="grid grid-cols-1 w-full gap-3">
                  {gameConfig?.preMatch?.StatsComponent ? (
                    <gameConfig.preMatch.StatsComponent teamData={teamData} allTeams={allTeams} />
                  ) : (
                    <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md flex items-center justify-center">
                      No stats component defined for this year.
                    </div>
                  )}
                </div>
              ) : (
                teamNum && <div className="text-sm text-muted-foreground">No match data available.</div>
              )}
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                {/* Fouls */}
                {analytics?.fouls && ((analytics.fouls.major || 0) > 0 || (analytics.fouls.yellowCards || 0) > 0) && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold leading-none">
                    <WarningIcon className="size-4" />
                    <span>{analytics.fouls.major || 0} Major, {analytics.fouls.yellowCards || 0} Yellow</span>
                  </div>
                )}

                {/* Pit Scout Capabilities Summary */}
                {capabilities && gameConfig?.preMatch?.CapabilitiesBadgeComponent && (
                  <gameConfig.preMatch.CapabilitiesBadgeComponent capabilities={capabilities} />
                )}
              </div>

              {/* Actions */}
              {teamData && (
                <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                  <Dialog>
                    <DialogTrigger render={
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold bg-background/50">
                        <NoteIcon className="size-4 mr-1" /> Notes
                      </Button>
                    } />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Team {teamNum} Scout Notes</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto space-y-4 pt-4">
                        {capabilities?.autoDescription && (
                          <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                            <div className="font-semibold text-sm mb-1 text-primary">Pit Scout - Auto Description</div>
                            <div className="text-sm whitespace-pre-wrap">{capabilities.autoDescription}</div>
                          </div>
                        )}
                        {capabilities?.notes && (
                          <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                            <div className="font-semibold text-sm mb-1 text-primary">Pit Scout - Notes</div>
                            <div className="text-sm whitespace-pre-wrap">{capabilities.notes}</div>
                          </div>
                        )}
                        {analytics?.notes?.map((note: any, i: number) => (
                          <div key={i} className="border border-border/50 rounded p-3 text-sm">
                            <div className="font-semibold text-primary mb-1">{note.title}</div>
                            <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                          </div>
                        ))}
                        {!capabilities?.notes && !capabilities?.autoDescription && (!analytics?.notes || analytics.notes.length === 0) && (
                          <div className="text-muted-foreground text-center py-4">No notes available.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold bg-background/50">
                        <WrenchIcon className="size-4 mr-1" /> Capabilities
                      </Button>
                    } />
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Team {teamNum} Capabilities</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[70vh] overflow-y-auto pt-4">
                        {capabilities ? (
                          gameConfig?.pitScout.CapabilitiesViewerComponent ? (
                            <gameConfig.pitScout.CapabilitiesViewerComponent data={capabilities} />
                          ) : (
                            <div className="text-muted-foreground text-center py-4">No capability viewer defined for this year.</div>
                          )
                        ) : (
                          <div className="text-muted-foreground text-center py-4">No capability data available.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold bg-background/50">
                        <ChartBarIcon className="size-4 mr-1" /> Detailed Stats
                      </Button>
                    } />
                    <DialogContent className="max-w-6xl w-[95vw]">
                      <DialogHeader>
                        <DialogTitle>Team {teamNum} Detailed Stats</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[70vh] overflow-y-auto pt-4">
                        {analytics ? (
                          gameConfig?.matchScout?.AnalyticsViewerComponent ? (
                            <gameConfig.matchScout.AnalyticsViewerComponent data={analytics} allTeamsData={Object.values(allTeams)} context="pre-match" />
                          ) : (
                            <div className="text-muted-foreground text-center py-4">No detailed stats viewer defined for this year.</div>
                          )
                        ) : (
                          <div className="text-muted-foreground text-center py-4">No match data available.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
