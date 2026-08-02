import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { GameConfig } from '@/lib/games/types';
import { z } from 'zod';

import { dimensionsSchema, driveTrainSchema } from '@/components/pit-scouting/schemas';

export const baseAnalyticsSchema = z.object({
  matchCount: z.number(),
  uptime: z.object({
    autoDeadCount: z.number(),
    teleopDeadCount: z.number(),
  }),
  fouls: z.object({
    major: z.number(),
    minor: z.number(),
    yellowCards: z.number().optional(),
    redCards: z.number().optional(),
  }),
  notes: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })),
  matchHistory: z.array(z.object({
    matchKey: z.string(),
    auto: z.number(),
    teleop: z.number(),
    endgame: z.number(),
    total: z.number(),
  })).optional()
});

export const getTeamDataSchema = (gameConfig: GameConfig) => {
  return z.object({
    eventId: z.string().optional(),
    teamId: z.string().optional(),
    name: z.string().optional(),
    nickname: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal('')),
    year: z.string().optional(),
    updatedAt: z.string().optional(),
    scoutId: z.string().optional(),
    scoutName: z.string().optional(),
    robot: gameConfig.pitScout.robotSchema.optional(),
    capabilities: gameConfig.pitScout.capabilitiesSchema.optional(),
    analytics: gameConfig.matchScout?.analyticsSchema
      ? baseAnalyticsSchema.and(gameConfig.matchScout.analyticsSchema).optional()
      : baseAnalyticsSchema.optional()
  });
};

const baseRobotSchema = dimensionsSchema.merge(driveTrainSchema);

export type TeamData = Omit<z.infer<ReturnType<typeof getTeamDataSchema>>, 'robot' | 'capabilities' | 'analytics'> & {
  robot?: z.infer<typeof baseRobotSchema> & { [key: string]: any };
  capabilities?: { [key: string]: any };
  analytics?: z.infer<typeof baseAnalyticsSchema> & { [key: string]: any };
};

export const getTeamDataConverter = (gameConfig: GameConfig): FirestoreDataConverter<TeamData> => {
  const schema = getTeamDataSchema(gameConfig);
  return {
    toFirestore: (data: TeamData): DocumentData => {
      return data as DocumentData;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TeamData => {
      const data = snapshot.data(options);
      const parsed = schema.safeParse(data);
      if (parsed.success) {
        return parsed.data as TeamData;
      } else {
        console.warn(`Data validation failed for team doc ${snapshot.id}:`, parsed.error);
        // Fallback to returning raw data casted, so the app doesn't break completely
        return data as TeamData;
      }
    }
  };
};

import { baseMatchSetupSchema, baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

export const getMatchDataSchema = (gameConfig: GameConfig) => {
  return z.object({
    eventId: z.string().optional(),
    teamId: z.string().optional(),
    year: z.string().optional(),
    updatedAt: z.string().optional(),
    scoutId: z.string().optional(),
    scoutName: z.string().optional(),
    matchSetup: baseMatchSetupSchema.optional(),
    auto: gameConfig.matchScout?.autoSchema.optional(),
    teleop: gameConfig.matchScout?.teleopSchema.optional(),
    endgame: gameConfig.matchScout?.endgameSchema.optional(),
  });
};

export type MatchData = Omit<z.infer<ReturnType<typeof getMatchDataSchema>>, 'auto' | 'teleop' | 'endgame'> & {
  auto?: z.infer<typeof baseAutoSchema> & { [key: string]: any };
  teleop?: z.infer<typeof baseTeleopSchema> & { [key: string]: any };
  endgame?: z.infer<typeof baseEndgameSchema> & { [key: string]: any };
};
