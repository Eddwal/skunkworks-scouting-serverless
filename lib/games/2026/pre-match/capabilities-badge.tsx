'use client';

import { z } from "zod"
import { capabilitiesSchema } from "../pit-scout/schema"
import { CapabilityBadge } from "@/components/ui/capability-badge"

export function RebuiltCapabilitiesBadge({ capabilities }: { capabilities?: z.infer<typeof capabilitiesSchema> }) {
  if (!capabilities) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      <CapabilityBadge show={capabilities.movement?.trench?.can} label="Trench" className="bg-blue-500/20 text-blue-700 dark:text-blue-300" />
      <CapabilityBadge show={capabilities.movement?.bump?.can} label="Bump" className="bg-orange-500/20 text-orange-700 dark:text-orange-300" />
      <CapabilityBadge show={capabilities.collection?.floor?.can} label="Floor Pickup" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" />
      <CapabilityBadge show={capabilities.collection?.depot?.can} label="Depot" className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" />
      <CapabilityBadge show={capabilities.collection?.chute?.can} label="Chute" className="bg-purple-500/20 text-purple-700 dark:text-purple-300" />
      <CapabilityBadge show={!!capabilities.climbing?.maxLevel && capabilities.climbing?.maxLevel !== 'No Climb'} label={`Climb: ${capabilities.climbing?.maxLevel}`} className="bg-red-500/20 text-red-700 dark:text-red-300" />
    </div>
  )
}
