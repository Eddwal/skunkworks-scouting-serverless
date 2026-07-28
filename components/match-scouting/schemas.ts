import { z } from 'zod';

export const baseMatchSetupSchema = z.object({
  matchKey: z.string().min(1, "Match is required"),
  scheduledTeamId: z.string().min(1, "Scheduled team is required"),
  isSubstitute: z.boolean().default(false),
  substituteTeamId: z.string().optional(),
  noShow: z.boolean().default(false),
});

export const baseAutoSchema = z.object({
  moved: z.boolean().default(false),
  died: z.boolean().default(false),
  majorFouls: z.coerce.number().min(0).default(0),
  minorFouls: z.coerce.number().min(0).default(0),
});

export const baseTeleopSchema = z.object({
  majorFouls: z.coerce.number().min(0).default(0),
  minorFouls: z.coerce.number().min(0).default(0),
  died: z.boolean().default(false),
});

export const baseEndgameSchema = z.object({
  yellowCard: z.boolean().default(false),
  redCard: z.boolean().default(false),
  notes: z.string().default(''),
});
