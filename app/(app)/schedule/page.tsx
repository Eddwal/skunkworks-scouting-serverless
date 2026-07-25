"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useEvent } from "@/hooks/use-event"
import { importTbaEvent } from "@/app/actions/events/add-event"
import { deleteEvent } from "@/app/actions/events/delete-event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeftIcon, TrashIcon } from "@phosphor-icons/react"
import { db } from "@/lib/firebase/firebase-client"
import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore"

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

export default function SchedulePage() {
  const { user, claims } = useAuth()
  const { activeEvent } = useEvent()
  const activeEventId = activeEvent?.id || ""
  const [eventKey, setEventKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    if (!activeEventId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches([])
      return
    }

    setLoadingMatches(true)
    const matchesRef = collection(db, "events", activeEventId, "matches")
    const q = query(matchesRef, orderBy("time", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMatches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[]
      setMatches(fetchedMatches)
      setLoadingMatches(false)
    }, (error) => {
      console.error("Error fetching matches:", error)
      setLoadingMatches(false)
    })

    return () => unsubscribe()
  }, [activeEventId])

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await importTbaEvent(eventKey, token)
      if (res.success) {
        toast.success(res.message)
        setEventKey("")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred importing the event")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!user || !activeEventId) return
    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await deleteEvent(activeEventId, token)
      if (res.success) {
        toast.success(res.message)
        setDeleteDialogOpen(false)
        window.location.reload() // Reload to fetch fresh events from layout
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event")
    } finally {
      setLoading(false)
    }
  }

  const formatMatchName = (level: string, set: number, match: number) => {
    switch(level) {
      case 'qm': return `Quals ${match}`
      case 'qf': return `Quarters ${set} Match ${match}`
      case 'sf': return `Semis ${set} Match ${match}`
      case 'f': return `Finals ${match}`
      default: return `${level.toUpperCase()} ${match}`
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
              <p className="text-muted-foreground">View upcoming matches and events.</p>
            </div>
          </div>
        </div>

        {claims?.admin && (
          <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg w-fit border shadow-sm">
            <div className="text-sm font-medium">Add Event:</div>
            <form onSubmit={handleImport} className="flex items-center gap-2">
              <Input 
                id="eventKey" 
                placeholder="TBA Event Key" 
                value={eventKey} 
                onChange={(e) => setEventKey(e.target.value)} 
                required 
                className="h-8 w-40 text-sm bg-background"
              />
              <Button type="submit" size="sm" className="h-8" disabled={loading || !eventKey}>
                {loading ? "Importing..." : "Import"}
              </Button>
            </form>
          </div>
        )}
        
        {activeEvent ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">{activeEvent.name} Schedule</h2>
              </div>
              <div className="flex items-center gap-4">
                {claims?.admin && (
                  <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    if (!open) setDeleteConfirmText("")
                  }}>
                    <DialogTrigger
                      render={
                        <Button variant="destructive" size="sm">
                          <TrashIcon className="mr-2 size-4" />
                          Delete Event
                        </Button>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This will permanently delete the event and all associated matches from the database.
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="confirm-delete">
                          Type <span className="font-bold select-all">delete event</span> to confirm.
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteEvent} 
                          disabled={loading || deleteConfirmText !== "delete event"}
                        >
                          {loading ? "Deleting..." : "Delete Event"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
            {loadingMatches ? (
              <div className="text-center text-muted-foreground p-8">Loading matches...</div>
            ) : matches.length > 0 ? (
              <div className="grid gap-2">
                {matches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-stretch">
                      {/* Match Info Side */}
                      <div className="w-full sm:w-48 p-3 flex items-center justify-between sm:justify-start sm:gap-4 border-b sm:border-b-0 sm:border-r">
                        <span className="font-semibold text-sm">
                          {formatMatchName(match.compLevel, match.setNumber, match.matchNumber)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {match.time 
                            ? new Date(match.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'TBD'
                          }
                        </span>
                      </div>
                      
                      {/* Alliances Side */}
                      <div className="flex-1 flex text-sm">
                        {/* Red Alliance */}
                        <div className="flex-1 bg-red-500/10 p-2 sm:p-3 flex items-center justify-evenly border-r border-red-500/20">
                          {match.redTeams?.map(t => (
                            <span key={t} className="font-bold text-red-700 dark:text-red-300">
                              {t.replace('frc','')}
                            </span>
                          ))}
                        </div>
                        
                        {/* Blue Alliance */}
                        <div className="flex-1 bg-blue-500/10 p-2 sm:p-3 flex items-center justify-evenly">
                          {match.blueTeams?.map(t => (
                            <span key={t} className="font-bold text-blue-700 dark:text-blue-300">
                              {t.replace('frc','')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                No matches found for this event.
              </div>
            )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No events available. {claims?.admin ? "Import an event to get started." : ""}
          </div>
        )}
      </div>
    </div>
  )
}
