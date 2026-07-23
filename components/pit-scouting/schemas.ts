import { z } from 'zod';

export const driveTrainSchema = z.object({
  driveType: z.string().min(1, "Drive type is required"),
  driveMotor: z.string().min(1, "Drive motor is required"),
});

export const dimensionsSchema = z.object({
  length: z.coerce.number({ message: "Length must be a valid number" }).min(1, "Length is required"),
  width: z.coerce.number({ message: "Width must be a valid number" }).min(1, "Width is required"),
  height: z.coerce.number({ message: "Height must be a valid number" }).min(1, "Height is required"),
  weight: z.coerce.number({ message: "Weight must be a valid number" }).min(1, "Weight is required"),
});

export const capRowSchema = z.object({
  can: z.boolean().default(false),
  auto: z.boolean().default(false)
});

export const canOnlySchema = z.object({
  can: z.boolean().default(false)
});

export const baseRobotSchema = dimensionsSchema.merge(driveTrainSchema);

export const baseCapabilitiesSchema = z.object({
  autoDescription: z.string().default(''),
  notes: z.string().default(''),
});
