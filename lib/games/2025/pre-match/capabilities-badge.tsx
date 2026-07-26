import { z } from "zod"
import { capabilitiesSchema } from "../schemas"
import { CapabilityBadge } from "@/components/ui/capability-badge"

export function ReefscapeCapabilitiesBadge({ capabilities }: { capabilities?: z.infer<typeof capabilitiesSchema> }) {
  if (!capabilities) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      <CapabilityBadge show={capabilities.coralL4?.can} label="L4" className="bg-purple-500/20 text-purple-700 dark:text-purple-300" />
      <CapabilityBadge show={capabilities.coralL3?.can} label="L3" className="bg-blue-500/20 text-blue-700 dark:text-blue-300" />
      <CapabilityBadge show={capabilities.coralL2?.can} label="L2" className="bg-green-500/20 text-green-700 dark:text-green-300" />
      <CapabilityBadge show={capabilities.coralL1?.can} label="L1" className="bg-zinc-500/20 text-zinc-700 dark:text-zinc-300" />
      <CapabilityBadge show={capabilities.deepClimb?.can} label="Deep" className="bg-primary text-primary-foreground" />
      <CapabilityBadge show={capabilities.shallowClimb?.can} label="Shallow" className="bg-secondary text-secondary-foreground" />
    </div>
  )
}
