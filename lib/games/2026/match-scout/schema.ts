import { z } from 'zod';
import { baseMatchSetupSchema, baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';
import { baseAnalyticsSchema } from '@/lib/firebase/converters';

export const analyticsSchema = z.object({
  totalAutoFuelScored: z.number().optional(),
  totalTeleopFuelScored: z.number().optional(),
  totalOverallFuelScored: z.number().optional(),
  avgAutoFuelScored: z.number().optional(),
  avgTeleopFuelScored: z.number().optional(),
  avgOverallFuelScored: z.number().optional(),
  totalMatchesAutoMoved: z.number().optional(),
  totalMatchesAutoDied: z.number().optional(),
  autoMovedPercentage: z.number().optional(),
  autoDiedPercentage: z.number().optional(),
});

// Match Scout Schemas
export const autoSchema = baseAutoSchema.extend({
  fuelScored: z.coerce.number().min(0).default(0),
});

export const teleopSchema = baseTeleopSchema.extend({
  fuelScored: z.coerce.number().min(0).default(0),
});

export const endgameSchema = baseEndgameSchema.extend({
  // Add year specific endgame fields here
});

export type MatchData2026 = {
  matchSetup: z.infer<typeof baseMatchSetupSchema>;
  auto: z.infer<typeof autoSchema>;
  teleop: z.infer<typeof teleopSchema>;
  endgame: z.infer<typeof endgameSchema>;
};

export type AnalyticsData2026 = z.infer<typeof baseAnalyticsSchema> & z.infer<typeof analyticsSchema>;
