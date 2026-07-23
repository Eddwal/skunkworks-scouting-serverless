import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { GameConfig } from '@/lib/games/types';
import { z } from 'zod';

import { dimensionsSchema, driveTrainSchema } from '@/components/pit-scouting/schemas';

export const getPitScoutSchema = (gameConfig: GameConfig) => {
  return z.object({
    eventId: z.string().optional(),
    teamId: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal('')),
    year: z.string().optional(),
    updatedAt: z.string().optional(),
    robot: gameConfig.pitScout.robotSchema,
    capabilities: gameConfig.pitScout.capabilitiesSchema,
  });
};

const baseRobotSchema = dimensionsSchema.merge(driveTrainSchema);

export type PitScoutData = Omit<z.infer<ReturnType<typeof getPitScoutSchema>>, 'robot' | 'capabilities'> & {
  robot?: z.infer<typeof baseRobotSchema> & { [key: string]: any };
  capabilities?: { [key: string]: any };
};

export const getPitScoutConverter = (gameConfig: GameConfig): FirestoreDataConverter<PitScoutData> => {
  const schema = getPitScoutSchema(gameConfig);
  return {
    toFirestore: (data: PitScoutData): DocumentData => {
      return data as DocumentData;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PitScoutData => {
      const data = snapshot.data(options);
      const parsed = schema.safeParse(data);
      if (parsed.success) {
        return parsed.data as PitScoutData;
      } else {
        console.warn(`Data validation failed for pitScout doc ${snapshot.id}:`, parsed.error);
        // Fallback to returning raw data casted, so the app doesn't break completely
        return data as PitScoutData;
      }
    }
  };
};
