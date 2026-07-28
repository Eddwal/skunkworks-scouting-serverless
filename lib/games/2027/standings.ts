import { TeamData } from '@/lib/firebase/converters';
import { AnalyticsData2027 } from './match-scout/schema';

export const calculateStandings = (teams: (TeamData & { id: string })[]) => {
  return teams.map(team => {
    const analytics = team.analytics as AnalyticsData2027 | undefined;
    let autoPoints = 0;
    let teleopPoints = 0;
    let endgamePoints = 0;

    if (analytics?.matchHistory && analytics.matchHistory.length > 0) {
      const matchCount = analytics.matchHistory.length;
      autoPoints = analytics.matchHistory.reduce((sum, match) => sum + match.auto, 0) / matchCount;
      teleopPoints = analytics.matchHistory.reduce((sum, match) => sum + match.teleop, 0) / matchCount;
      endgamePoints = analytics.matchHistory.reduce((sum, match) => sum + match.endgame, 0) / matchCount;
    }

    return {
      teamId: team.id,
      auto: Number(autoPoints.toFixed(1)),
      teleop: Number(teleopPoints.toFixed(1)),
      endgame: Number(endgamePoints.toFixed(1)),
      total: autoPoints + teleopPoints + endgamePoints,
    };
  }).sort((a, b) => b.total - a.total).map((t, index) => ({
    ...t,
    rank: index + 1
  }));
};
