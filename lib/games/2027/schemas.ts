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

export const analyticsSchema = z.object({
  // Add year specific analytics fields here (these will be intersected with the base analytics schema)
});

import { baseAnalyticsSchema } from '@/lib/firebase/converters';

export type AnalyticsData2027 = z.infer<typeof baseAnalyticsSchema> & z.infer<typeof analyticsSchema>;
