import { z } from 'zod';
import { capRowSchema, canOnlySchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';
import { baseMatchSetupSchema, baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

// Pit Scout Schemas
export const robotSchema = baseRobotSchema.extend({
  // Add year specific robot fields here
  // exampleField: z.coerce.number().min(0),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  coralL4: capRowSchema.default({ can: false, auto: false }),
  coralL3: capRowSchema.default({ can: false, auto: false }),
  coralL2: capRowSchema.default({ can: false, auto: false }),
  coralL1: capRowSchema.default({ can: false, auto: false }),
  deepClimb: canOnlySchema.default({ can: false }),
  shallowClimb: canOnlySchema.default({ can: false }),
});

export const analyticsSchema = z.object({
  totalAutoCoralL4: z.number().optional(),
  totalTeleopCoralL4: z.number().optional(),
  totalOverallCoralL4: z.number().optional(),
  avgAutoCoralL4: z.number().optional(),
  avgTeleopCoralL4: z.number().optional(),
  avgOverallCoralL4: z.number().optional(),

  totalAutoCoralL3: z.number().optional(),
  totalTeleopCoralL3: z.number().optional(),
  totalOverallCoralL3: z.number().optional(),
  avgAutoCoralL3: z.number().optional(),
  avgTeleopCoralL3: z.number().optional(),
  avgOverallCoralL3: z.number().optional(),

  totalAutoCoralL2: z.number().optional(),
  totalTeleopCoralL2: z.number().optional(),
  totalOverallCoralL2: z.number().optional(),
  avgAutoCoralL2: z.number().optional(),
  avgTeleopCoralL2: z.number().optional(),
  avgOverallCoralL2: z.number().optional(),

  totalAutoCoralL1: z.number().optional(),
  totalTeleopCoralL1: z.number().optional(),
  totalOverallCoralL1: z.number().optional(),
  avgAutoCoralL1: z.number().optional(),
  avgTeleopCoralL1: z.number().optional(),
  avgOverallCoralL1: z.number().optional(),
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

export type MatchData2025 = {
  matchSetup: z.infer<typeof baseMatchSetupSchema>;
  auto: z.infer<typeof autoSchema>;
  teleop: z.infer<typeof teleopSchema>;
  endgame: z.infer<typeof endgameSchema>;
};

import { baseAnalyticsSchema } from '@/lib/firebase/converters';
export type AnalyticsData2025 = z.infer<typeof baseAnalyticsSchema> & z.infer<typeof analyticsSchema>;
