import { z } from 'zod';
import { capRowSchema, canOnlySchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';

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
