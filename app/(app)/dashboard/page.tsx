"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEvent } from "@/hooks/use-event"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { APPS } from "@/lib/apps"
import { getGameConfig, DEFAULT_YEAR } from "@/lib/games"
import { Suspense } from "react"

function AppCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string
  title: string
  description: string
  icon: React.ElementType
}) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const fullHref = `${href}?${params.toString()}`

  return (
    <Link href={fullHref} className="group">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

function DashboardPageContent() {
  const { claims } = useAuth()
  const { activeEvent } = useEvent()
  const year = activeEvent?.id ? activeEvent.id.substring(0, 4) : DEFAULT_YEAR
  const gameConfig = getGameConfig(year)
  const DashboardComponent = gameConfig.DashboardComponent

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex justify-between items-end">
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">{gameConfig.year} - {gameConfig.name}</p>
             </div>
          </div>
          
          {DashboardComponent && (
            <div className="space-y-4">
               <DashboardComponent />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Apps</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {APPS.filter(app => (!app.adminOnly || (claims && claims.admin)) && app.name != "Dashboard").map(app => (
                <AppCard 
                  key={app.href} 
                  href={app.href} 
                  title={app.title} 
                  description={app.description} 
                  icon={app.icon} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6 md:p-10">Loading Dashboard...</div>}>
      <DashboardPageContent />
    </Suspense>
  )
}
