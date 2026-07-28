import { TeamData } from '@/lib/firebase/converters';
import { AnalyticsData2025 } from '../match-scout/schema';
import { calculateDenseRank } from '@/lib/utils';

export const getAdditionalHeaderStats = (
  teamData: TeamData,
  initialTeams: (TeamData & { id: string })[]
) => {
  const stats: { label: string; value: number | string; rank: number | string; description?: string }[] = [];
  
  /* Example stat:
  const analytics = teamData.analytics as AnalyticsData2025 | undefined;
  if (analytics) {
    const value = analytics.coral?.l1 ?? 0;
    const allValues = initialTeams.map(t => (t.analytics as AnalyticsData2025 | undefined)?.coral?.l1 ?? 0);
    const { rank, totalRanks } = calculateDenseRank(value, allValues);
    
    stats.push({
      label: 'Coral L1',
      value: value.toFixed(1),
      rank: rank > 0 ? \`\${rank} of \${totalRanks}\` : 'N/A',
      description: 'Average level 1 coral scored'
    });
  }
  */

  return stats;
};
