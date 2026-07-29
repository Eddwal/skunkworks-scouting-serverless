import { z } from 'zod';

export const baseSchema = z.object({
  matchNumber: z.number().int().positive(),
  teamNumber: z.number().int().positive(),
});
