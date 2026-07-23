import { z } from 'zod';
import { capRowSchema, canOnlySchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';

export const robotSchema = baseRobotSchema.extend({
  hopperCapacity: z.coerce.number({ message: "Hopper Capacity must be a valid number" }).min(0, "Hopper capacity cannot be negative"),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  movement: z.object({
    move: capRowSchema.default({ can: false, auto: false }),
    trench: canOnlySchema.default({ can: false }),
    bump: capRowSchema.default({ can: false, auto: false }),
  }),
  shooting: z.object({
    shoot: capRowSchema.default({ can: false, auto: false }),
  }),
  collection: z.object({
    floor: canOnlySchema.default({ can: false }),
    depot: capRowSchema.default({ can: false, auto: false }),
    chute: capRowSchema.default({ can: false, auto: false }),
  }),
  climbing: z.object({
    maxLevel: z.enum(['No Climb', 'L1', 'L2', 'L3']).default('No Climb'),
    autoClimb: z.boolean().default(false),
  })
});
