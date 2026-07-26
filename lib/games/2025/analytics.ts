import { z } from 'zod';
import { autoSchema, teleopSchema, endgameSchema, MatchData2025, AnalyticsData2025 } from './schemas';
import { baseMatchSetupSchema } from '@/components/match-scouting/schemas';
import { TeamData } from '@/lib/firebase/converters';

export function processAnalytics(currentAnalytics: AnalyticsData2025, matchData: MatchData2025): AnalyticsData2025 {
  const matchCount = currentAnalytics.matchCount; // This is the new match count, already incremented
  
  const levels = ['CoralL4', 'CoralL3', 'CoralL2', 'CoralL1'] as const;

  levels.forEach(level => {
    // the form uses camelCase e.g., coralL4, coralL3
    const fieldName = (level.charAt(0).toLowerCase() + level.slice(1)) as 'coralL4' | 'coralL3' | 'coralL2' | 'coralL1';

    const autoVal = matchData.auto?.[fieldName] || 0;
    const teleopVal = matchData.teleop?.[fieldName] || 0;
    const overallVal = autoVal + teleopVal;

    currentAnalytics[`totalAuto${level}`] = (currentAnalytics[`totalAuto${level}`] || 0) + autoVal;
    currentAnalytics[`totalTeleop${level}`] = (currentAnalytics[`totalTeleop${level}`] || 0) + teleopVal;
    currentAnalytics[`totalOverall${level}`] = (currentAnalytics[`totalOverall${level}`] || 0) + overallVal;

    if (matchCount > 0) {
      currentAnalytics[`avgAuto${level}`] = (currentAnalytics[`totalAuto${level}`] || 0) / matchCount;
      currentAnalytics[`avgTeleop${level}`] = (currentAnalytics[`totalTeleop${level}`] || 0) / matchCount;
      currentAnalytics[`avgOverall${level}`] = (currentAnalytics[`totalOverall${level}`] || 0) / matchCount;
    }
  });

  if (matchData.endgame?.climbStatus === 'deep') {
    currentAnalytics.totalDeepClimbs = (currentAnalytics.totalDeepClimbs || 0) + 1;
  } else if (matchData.endgame?.climbStatus === 'shallow') {
    currentAnalytics.totalShallowClimbs = (currentAnalytics.totalShallowClimbs || 0) + 1;
  }

  return currentAnalytics;
}
