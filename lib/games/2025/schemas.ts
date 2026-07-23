import { z } from 'zod';
import { capRowSchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';

export const robotSchema = baseRobotSchema.extend({
  hopperCapacity: z.coerce.number({ message: "Hopper Capacity must be a valid number" }).min(0, "Hopper capacity cannot be negative"),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  coralL1: capRowSchema.default({ can: false, auto: false }),
  coralL2: capRowSchema.default({ can: false, auto: false }),
  coralL3: capRowSchema.default({ can: false, auto: false }),
  coralL4: capRowSchema.default({ can: false, auto: false }),
  algaeProcessor: capRowSchema.default({ can: false, auto: false }),
  algaeNet: capRowSchema.default({ can: false, auto: false })
});
