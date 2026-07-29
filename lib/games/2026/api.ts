import { z } from 'zod';
import { baseSchema } from '../api-schema';

export const teamAppendSchema = baseSchema.catchall(z.any());

export const matchAppendSchema = baseSchema.catchall(z.any());