"use client"

import { useState, useEffect } from "react"
import { useEvent } from "@/hooks/use-event"
import { db } from "@/lib/firebase/firebase-client"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { getTeamDataConverter, TeamData } from "@/lib/firebase/converters"
import { getGameConfig } from "@/lib/games"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseTeamCard } from "@/components/pre-match/base-team-card"
import { AllianceRadarChart } from "@/components/pre-match/alliance-radar-chart"
import { MatchSelect } from "@/components/ui/match-select"
import { formatMatchName } from "@/lib/utils"

// Match interface matching the one in schedule page
interface Match {
  id: string
  matchKey: string
  compLevel: string
  matchNumber: number
  setNumber: number
  time: number
  redTeams: string[]
  blueTeams: string[]
}


export default function PreMatchDashboard() {
  const { activeEvent } = useEvent()
  const activeEventId = activeEvent?.id || ""

  const [matches, setMatches] = useState<Match[]>([])
  const [teamsData, setTeamsData] = useState<Record<string, TeamData>>({})
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>("")
  
  // Local state for the 6 currently selected teams (in case user overrides them)
  const [currentRedTeams, setCurrentRedTeams] = useState<string[]>(['', '', ''])
  const [currentBlueTeams, setCurrentBlueTeams] = useState<string[]>(['', '', ''])

  const handleMatchSelect = (match: Match | undefined) => {
    if (!match) return
    setSelectedMatchId(match.id)
    setCurrentRedTeams([...(match.redTeams || []), '', '', ''].slice(0, 3))
    setCurrentBlueTeams([...(match.blueTeams || []), '', '', ''].slice(0, 3))
  }

  useEffect(() => {
    if (!activeEventId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeamsData({})
      return
    }

    // Fetch matches
    const matchesRef = collection(db, "events", activeEventId, "matches")
    const qMatches = query(matchesRef, orderBy("time", "asc"))

    const unsubMatches = onSnapshot(qMatches, (snapshot) => {
      const fetchedMatches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[]
      setMatches(fetchedMatches)
    })

    // Fetch teams
    const gameConfig = getGameConfig(activeEventId ? activeEventId.substring(0, 4) : undefined)
    const teamsRef = collection(db, "events", activeEventId, "teams").withConverter(getTeamDataConverter(gameConfig))
    
    const unsubTeams = onSnapshot(teamsRef, (snapshot) => {
      const newTeamsData: Record<string, TeamData> = {}
      snapshot.forEach(doc => {
        const rawId = doc.id
        newTeamsData[rawId] = { id: doc.id, ...doc.data() } as TeamData & { id: string }
      })
      setTeamsData(newTeamsData)
    })

    return () => {
      unsubMatches()
      unsubTeams()
    }
  }, [activeEventId])

  useEffect(() => {
    if (!selectedMatchId && matches.length > 0) {
      handleMatchSelect(matches[0])
    } else if (selectedMatchId) {
      const currentMatch = matches.find(m => m.id === selectedMatchId)
      if (currentMatch && currentRedTeams[0] === '' && currentBlueTeams[0] === '') {
         handleMatchSelect(currentMatch)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches])

  const year = activeEventId ? activeEventId.substring(0, 4) : undefined
  const gameConfig = getGameConfig(year)

  return (
    <div className="flex min-h-svh flex-col bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[100rem] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pre-Match Dashboard</h1>
            <p className="text-sm text-muted-foreground">Strategize and compare alliance capabilities.</p>
          </div>
          {activeEventId && matches.length > 0 && (
            <div className="w-full md:w-auto shrink-0 ml-auto flex justify-end">
              <MatchSelect 
                className="w-full md:w-[300px]"
                matches={matches as any} 
                value={selectedMatchId} 
                onValueChange={(val) => {
                  const m = matches.find(x => x.id === val)
                  handleMatchSelect(m)
                }}
                valueKey="id"
              />
            </div>
          )}
        </div>

        {activeEventId ? (
          <div className="space-y-6">
            {selectedMatchId ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Red Alliance */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600" />
                    Red Alliance
                  </h2>
                  <div className="flex flex-col gap-4">
                    {currentRedTeams.map((teamNum, idx) => (
                      <BaseTeamCard
                        key={`red-${idx}`}
                        teamNum={teamNum}
                        teamData={teamsData[teamNum]}
                        allTeams={teamsData}
                        alliance="red"
                        gameConfig={gameConfig}
                        onTeamChange={(newTeam) => {
                          const newTeams = [...currentRedTeams]
                          newTeams[idx] = newTeam === 'empty' ? '' : newTeam
                          setCurrentRedTeams(newTeams)
                        }}
                      />
                    ))}
                  </div>
                  <AllianceRadarChart 
                    alliance="red" 
                    teams={currentRedTeams} 
                    teamsData={teamsData} 
                    gameConfig={gameConfig}
                  />
                </div>

                {/* Blue Alliance */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600" />
                    Blue Alliance
                  </h2>
                  <div className="flex flex-col gap-4">
                    {currentBlueTeams.map((teamNum, idx) => (
                      <BaseTeamCard
                        key={`blue-${idx}`}
                        teamNum={teamNum}
                        teamData={teamsData[teamNum]}
                        allTeams={teamsData}
                        alliance="blue"
                        gameConfig={gameConfig}
                        onTeamChange={(newTeam) => {
                          const newTeams = [...currentBlueTeams]
                          newTeams[idx] = newTeam === 'empty' ? '' : newTeam
                          setCurrentBlueTeams(newTeams)
                        }}
                      />
                    ))}
                  </div>
                  <AllianceRadarChart 
                    alliance="blue" 
                    teams={currentBlueTeams} 
                    teamsData={teamsData}
                    gameConfig={gameConfig} 
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
                Please select a match to view.
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
            Please select an active event to view the pre-match dashboard.
          </div>
        )}
      </div>
    </div>
  )
}
