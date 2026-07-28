import { z } from 'zod';
import { baseMatchSetupSchema, baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

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

export type MatchData2027 = {
  matchSetup: z.infer<typeof baseMatchSetupSchema>;
  auto: z.infer<typeof autoSchema>;
  teleop: z.infer<typeof teleopSchema>;
  endgame: z.infer<typeof endgameSchema>;
};

export type AnalyticsData2027 = z.infer<typeof baseAnalyticsSchema> & z.infer<typeof analyticsSchema>;
