import { z } from 'zod';
import { capRowSchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';
import { baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

// Pit Scout Schemas
export const robotSchema = baseRobotSchema.extend({
  hopperCapacity: z.coerce.number({ message: "Hopper Capacity must be a valid number" }).min(0, "Hopper capacity cannot be negative"),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  movement: z.object({
    move: capRowSchema.default({ can: false, auto: false }),
    trench: capRowSchema.default({ can: false, auto: false }),
    bump: capRowSchema.default({ can: false, auto: false })
  }).default({} as any),
  shooting: z.object({
    shoot: capRowSchema.default({ can: false, auto: false })
  }).default({} as any),
  collection: z.object({
    floor: capRowSchema.default({ can: false, auto: false }),
    depot: capRowSchema.default({ can: false, auto: false }),
    chute: capRowSchema.default({ can: false, auto: false })
  }).default({} as any),
  climbing: z.object({
    maxLevel: z.string().default('No Climb'),
    autoClimb: z.boolean().default(false)
  }).default({} as any)
});

// Match Scout Schemas
export const autoSchema = baseAutoSchema.extend({
  // Add year specific auto fields here
});

export const teleopSchema = baseTeleopSchema.extend({
  // Add year specific teleop fields here
});

export const endgameSchema = baseEndgameSchema.extend({
  // Add year specific endgame fields here
});
