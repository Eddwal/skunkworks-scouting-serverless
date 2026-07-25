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
    
    // 1. Create schemas.ts
    const schemasContent = `import { z } from 'zod';
import { capRowSchema, baseRobotSchema, baseCapabilitiesSchema } from '@/components/pit-scouting/schemas';
import { baseAutoSchema, baseTeleopSchema, baseEndgameSchema } from '@/components/match-scouting/schemas';

// Pit Scout Schemas
export const robotSchema = baseRobotSchema.extend({
  // Add year specific robot fields here
  // exampleField: z.coerce.number().min(0),
});

export const capabilitiesSchema = baseCapabilitiesSchema.extend({
  // Add year specific capabilities fields here
  // exampleCapability: capRowSchema.default({ can: false, auto: false }),
});

// Match Scout Schemas
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
`;
    await fs.writeFile(path.join(baseDir, 'schemas.ts'), schemasContent);

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

    // 4. Create team-viewer.tsx
    const teamViewerContent = `import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => null;

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      {/* Add year specific capability viewer rows here */}
    </div>
  );
};
`;
    await fs.writeFile(path.join(baseDir, 'team-viewer.tsx'), teamViewerContent);

    // 5. Create analytics.ts
    const analyticsContent = `export function processAnalytics(currentAnalytics: any, matchData: any) {
  // Add your year-specific analytics logic here!
  // currentAnalytics contains the base metrics (matchCount, fouls, uptime).
  // matchData contains the raw match scout submission (auto, teleop, endgame).
  
  // Example: 
  // const totalCoral = (currentAnalytics.totalCoral || 0) + (matchData.teleop?.coralScored || 0);
  // currentAnalytics.totalCoral = totalCoral;
  // currentAnalytics.avgCoralScored = totalCoral / currentAnalytics.matchCount;

  return currentAnalytics;
}
`;
    await fs.writeFile(path.join(baseDir, 'analytics.ts'), analyticsContent);

    // 6. Create index.ts
    const indexContent = `import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema, autoSchema, teleopSchema, endgameSchema, analyticsSchema } from './schemas';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent } from './team-viewer';
import { processAnalytics } from './analytics';

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
};
`;
    await fs.writeFile(path.join(baseDir, 'index.ts'), indexContent);

    // 7. Update lib/games/index.ts
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
