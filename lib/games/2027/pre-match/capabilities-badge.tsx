import { z } from "zod"
import { capabilitiesSchema } from "../pit-scout/schema"

export function Year2027CapabilitiesBadge({ capabilities }: { capabilities?: z.infer<typeof capabilitiesSchema> }) {
  if (!capabilities) return null;
  return (
    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
      {/* Add year specific capability badges here */}
    </div>
  )
}
