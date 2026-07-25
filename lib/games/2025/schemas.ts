import { z } from 'zod';
import { capRowSchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';
import { baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

// Pit Scout Schemas
export const robotSchema = baseRobotSchema.extend({
  // Add year specific robot fields here
  // exampleField: z.coerce.number().min(0),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  // Add year specific capabilities fields here
  // exampleCapability: capRowSchema.default({ can: false, auto: false }),
});

export const analyticsSchema = z.object({
  avgCoralL1: z.number().optional(),
  avgCoralL2: z.number().optional(),
  avgCoralL3: z.number().optional(),
  avgCoralL4: z.number().optional(),
  totalCoralL1: z.number().optional(),
  totalCoralL2: z.number().optional(),
  totalCoralL3: z.number().optional(),
  totalCoralL4: z.number().optional(),
});

// Match Scout Schemas
export const autoSchema = baseAutoSchema.extend({
  coralL1: z.coerce.number().min(0).default(0),
  coralL2: z.coerce.number().min(0).default(0),
  coralL3: z.coerce.number().min(0).default(0),
  coralL4: z.coerce.number().min(0).default(0),
});

export const teleopSchema = baseTeleopSchema.extend({
  coralL1: z.coerce.number().min(0).default(0),
  coralL2: z.coerce.number().min(0).default(0),
  coralL3: z.coerce.number().min(0).default(0),
  coralL4: z.coerce.number().min(0).default(0),
});

export const endgameSchema = baseEndgameSchema.extend({
  // Add year specific endgame fields here
});
