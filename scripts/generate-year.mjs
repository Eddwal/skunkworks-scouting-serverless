import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateYear() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: npm run generate-year <year> <game-name>");
    console.error("Example: npm run generate-year 2027 'Water Game'");
    process.exit(1);
  }

  const year = args[0];
  const name = args[1];
  
  if (!/^\d{4}$/.test(year)) {
    console.error("Year must be a 4-digit number.");
    process.exit(1);
  }

  const baseDir = path.join(__dirname, '..', 'lib', 'games', year);
  
  try {
    await fs.mkdir(path.join(baseDir, 'pit-scout'), { recursive: true });
    await fs.mkdir(path.join(baseDir, 'match-scout'), { recursive: true });
    
    // 1. Create pit-scout/schema.ts
    const pitScoutSchemaContent = `import { z } from 'zod';
import { capRowSchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';

export const robotSchema = baseRobotSchema.extend({
  // Add year specific robot fields here
  // exampleField: z.coerce.number().min(0),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  // Add year specific capabilities fields here
  // exampleCapability: capRowSchema.default({ can: false, auto: false }),
});
`;
    await fs.writeFile(path.join(baseDir, 'pit-scout', 'schema.ts'), pitScoutSchemaContent);

    // 1b. Create match-scout/schema.ts
    const matchScoutSchemaContent = `import { z } from 'zod';
import { baseAutoSchema, baseTeleopSchema, baseEndgameSchema, baseMatchSetupSchema } from '@/components/match-scouting/schemas';

export const autoSchema = baseAutoSchema.extend({
  // Add year specific auto fields here
});

export const teleopSchema = baseTeleopSchema.extend({
  // Add year specific teleop fields here
});

export const endgameSchema = baseEndgameSchema.extend({
  // Add year specific endgame fields here
});

export const analyticsSchema = z.object({
  // Add year specific analytics fields here (these will be intersected with the base analytics schema)
});

import { baseAnalyticsSchema } from '@/lib/firebase/converters';

export type MatchData${year} = {
  matchSetup: z.infer<typeof baseMatchSetupSchema>;
  auto: z.infer<typeof autoSchema>;
  teleop: z.infer<typeof teleopSchema>;
  endgame: z.infer<typeof endgameSchema>;
};

export type AnalyticsData${year} = z.infer<typeof baseAnalyticsSchema> & z.infer<typeof analyticsSchema>;
`;
    await fs.writeFile(path.join(baseDir, 'match-scout', 'schema.ts'), matchScoutSchemaContent);

    // 2. Create pit-scout/robot.tsx
    const robotContent = `import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from '../../types';
import { BasePitScoutRobot } from '@/components/pit-scouting/base-robot-form';

export function PitScoutRobot(props: FormComponentProps) {
  const { control, errors } = props;
  
  return (
    <BasePitScoutRobot {...props} yearSpecificTitle="${year} Specifics">
      {/* Add year specific form fields here */}
    </BasePitScoutRobot>
  );
}
`;
    await fs.writeFile(path.join(baseDir, 'pit-scout', 'robot.tsx'), robotContent);

    // 3. Create pit-scout/capabilities.tsx
    const capabilitiesContent = `import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { CapabilityRow, SectionHeader } from '@/components/pit-scouting/capabilities';
import { BasePitScoutCapabilities } from '@/components/pit-scouting/base-capabilities-form';

export function PitScoutCapabilities(props: FormComponentProps) {
  const { control } = props;
  
  return (
    <BasePitScoutCapabilities {...props}>
      {/* Add year specific capability fields here */}
    </BasePitScoutCapabilities>
  );
}
`;
    await fs.writeFile(path.join(baseDir, 'pit-scout', 'capabilities.tsx'), capabilitiesContent);

    // Match Scout: Create match-scout/auto.tsx
    const matchScoutAutoContent = `import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseAutoForm } from '@/components/match-scouting/base-auto-form';

export function MatchScoutAuto(props: FormComponentProps) {
  return (
    <BaseAutoForm {...props} yearSpecificTitle="${year} Auto">
      {/* Add year specific auto fields here */}
    </BaseAutoForm>
  );
}
`;
    await fs.writeFile(path.join(baseDir, 'match-scout', 'auto.tsx'), matchScoutAutoContent);

    // Match Scout: Create match-scout/teleop.tsx
    const matchScoutTeleopContent = `import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseTeleopForm } from '@/components/match-scouting/base-teleop-form';

export function MatchScoutTeleop(props: FormComponentProps) {
  return (
    <BaseTeleopForm {...props} yearSpecificTitle="${year} Teleop">
      {/* Add year specific teleop fields here */}
    </BaseTeleopForm>
  );
}
`;
    await fs.writeFile(path.join(baseDir, 'match-scout', 'teleop.tsx'), matchScoutTeleopContent);

    // Match Scout: Create match-scout/endgame.tsx
    const matchScoutEndgameContent = `import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseEndgameForm } from '@/components/match-scouting/base-endgame-form';

export function MatchScoutEndgame(props: FormComponentProps) {
  return (
    <BaseEndgameForm {...props} yearSpecificTitle="${year} Endgame">
      {/* Add year specific endgame fields here */}
    </BaseEndgameForm>
  );
}
`;
    await fs.writeFile(path.join(baseDir, 'match-scout', 'endgame.tsx'), matchScoutEndgameContent);

    // 4. Create team-viewer components
    await fs.mkdir(path.join(baseDir, 'team-viewer'), { recursive: true });
    
    const teamViewerContent = `import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema } from '../pit-scout/schema';
import { analyticsSchema } from '../match-scout/schema';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => null;

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      {/* Add year specific capability viewer rows here */}
    </div>
  );
};
`;
    await fs.writeFile(path.join(baseDir, 'team-viewer', 'components.tsx'), teamViewerContent);

    // 4b. Create team-viewer header stats
    const headerStatsContent = `import { TeamData } from '@/lib/firebase/converters';
import { AnalyticsData${year} } from '../match-scout/schema';
import { calculateDenseRank } from '@/lib/utils';

export const getAdditionalHeaderStats = (
  teamData: TeamData,
  initialTeams: (TeamData & { id: string })[]
) => {
  const stats: { label: string; value: number | string; rank: number | string; description?: string }[] = [];
  
  /* Example stat:
  const analytics = teamData.analytics as AnalyticsData${year} | undefined;
  if (analytics) {
    const value = analytics.someValue ?? 0;
    const allValues = initialTeams.map(t => (t.analytics as AnalyticsData${year} | undefined)?.someValue ?? 0);
    const { rank, totalRanks } = calculateDenseRank(value, allValues);
    
    stats.push({
      label: 'Sample Stat',
      value: value.toFixed(1),
      rank: rank > 0 ? \`\${rank} of \${totalRanks}\` : 'N/A',
      description: 'Average sample value scored'
    });
  }
  */

  return stats;
};
`;
    await fs.writeFile(path.join(baseDir, 'team-viewer', 'header-stats.ts'), headerStatsContent);

    // 5. Create analytics.ts
    const analyticsContent = `export function processAnalytics(currentAnalytics: any, matchData: any) {
  // Add your year-specific analytics logic here!
  // currentAnalytics contains the base metrics (matchCount, fouls, uptime).
  // matchData contains the raw match scout submission (auto, teleop, endgame).
  
  return currentAnalytics;
}

export function calculateMatchPoints(matchData: any) {
  // Add your year-specific logic here
  const autoPoints = 0;
  const teleopPoints = 0;
  const endgamePoints = 0;

  return {
    matchKey: matchData.matchSetup?.matchKey || '',
    auto: autoPoints,
    teleop: teleopPoints,
    endgame: endgamePoints,
    total: autoPoints + teleopPoints + endgamePoints
  };
}
`;
    await fs.writeFile(path.join(baseDir, 'analytics.ts'), analyticsContent);

    // 6. Create standings.ts
    const standingsContent = `import { TeamData } from '@/lib/firebase/converters';
import { AnalyticsData${year} } from './match-scout/schema';

export const calculateStandings = (teams: (TeamData & { id: string })[]) => {
  return teams.map(team => {
    const analytics = team.analytics as AnalyticsData${year} | undefined;
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
`;
    await fs.writeFile(path.join(baseDir, 'standings.ts'), standingsContent);

    // 7. Create Pre-Match Components
    await fs.mkdir(path.join(baseDir, 'pre-match'), { recursive: true });
    
    const preMatchStatsContent = `import { TeamData } from "@/lib/firebase/converters"

export function Year${year}Stats({ teamData, allTeams }: { teamData?: TeamData; allTeams: Record<string, TeamData> }) {
  if (!teamData) return null;
  return (
    <div className="grid grid-cols-2 gap-3 p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
      Define ${year} specific stats here
    </div>
  )
}
`;
    await fs.writeFile(path.join(baseDir, 'pre-match', 'stats.tsx'), preMatchStatsContent);

    const preMatchCapabilitiesContent = `import { z } from "zod"
import { capabilitiesSchema } from "../pit-scout/schema"

export function Year${year}CapabilitiesBadge({ capabilities }: { capabilities?: z.infer<typeof capabilitiesSchema> }) {
  if (!capabilities) return null;
  return (
    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
      {/* Add year specific capability badges here */}
    </div>
  )
}
`;
    await fs.writeFile(path.join(baseDir, 'pre-match', 'capabilities-badge.tsx'), preMatchCapabilitiesContent);

    // 7b. Create api.ts
    const apiContent = `import { z } from 'zod';
import { baseSchema } from '../schema';

export const teamAppendSchema = baseSchema.catchall(z.any());
export const matchAppendSchema = baseSchema.catchall(z.any());
`;
    await fs.writeFile(path.join(baseDir, 'api.ts'), apiContent);

    // 8. Create index.ts
    const indexContent = `import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema } from './pit-scout/schema';
import { autoSchema, teleopSchema, endgameSchema, analyticsSchema, AnalyticsData${year} } from './match-scout/schema';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent } from './team-viewer/components';
import { getAdditionalHeaderStats } from './team-viewer/header-stats';
import { processAnalytics, calculateMatchPoints } from './analytics';
import { calculateStandings } from './standings';
import { Year${year}Stats } from './pre-match/stats';
import { Year${year}CapabilitiesBadge } from './pre-match/capabilities-badge';
import { teamAppendSchema, matchAppendSchema } from './api';

export const Game${year}: GameConfig = {
  year: '${year}',
  name: '${name}',
  pitScout: {
    robotSchema,
    capabilitiesSchema,
    RobotComponent: PitScoutRobot,
    CapabilitiesComponent: PitScoutCapabilities,
    RobotViewerComponent,
    CapabilitiesViewerComponent,
  },
  matchScout: {
    autoSchema,
    teleopSchema,
    endgameSchema,
    analyticsSchema,
    processAnalytics,
    AutoComponent: MatchScoutAuto,
    TeleopComponent: MatchScoutTeleop,
    EndgameComponent: MatchScoutEndgame,
  },
  standings: {
    calculateStandings
  },
  preMatch: {
    StatsComponent: Year${year}Stats,
    CapabilitiesBadgeComponent: Year${year}CapabilitiesBadge,
    radarMetrics: [
      // Add radar metrics here, e.g. { key: "avgPoints", label: "Points" }
    ],
  },
  teamViewer: {
    getAdditionalHeaderStats,
  },
  api: {
    teamAppendSchema,
    matchAppendSchema,
  },
  calculateMatchPoints
};
`;
    await fs.writeFile(path.join(baseDir, 'index.ts'), indexContent);

    // 8. Update lib/games/index.ts
    const indexFilePath = path.join(__dirname, '..', 'lib', 'games', 'index.ts');
    let mainIndexContent = await fs.readFile(indexFilePath, 'utf8');
    
    if (!mainIndexContent.includes(`'${year}': Game${year}`)) {
      // Add import
      const importStatement = `import { Game${year} } from './${year}';\n`;
      // Find last import
      const lastImportIndex = mainIndexContent.lastIndexOf('import ');
      const endOfLastImport = mainIndexContent.indexOf('\n', lastImportIndex) + 1;
      mainIndexContent = mainIndexContent.slice(0, endOfLastImport) + importStatement + mainIndexContent.slice(endOfLastImport);

      // Add to GAME_CONFIGS
      const configMarker = 'const GAME_CONFIGS: Record<string, GameConfig> = {';
      const configMarkerIndex = mainIndexContent.indexOf(configMarker);
      if (configMarkerIndex !== -1) {
        const insertionIndex = mainIndexContent.indexOf('\n', configMarkerIndex) + 1;
        const configStatement = `  '${year}': Game${year},\n`;
        mainIndexContent = mainIndexContent.slice(0, insertionIndex) + configStatement + mainIndexContent.slice(insertionIndex);
      }
      
      await fs.writeFile(indexFilePath, mainIndexContent);
    }
    
    console.log(`Successfully generated scaffolding for ${year} - ${name}!`);
    
  } catch (err) {
    console.error("Error generating year:", err);
    process.exit(1);
  }
}

generateYear();
