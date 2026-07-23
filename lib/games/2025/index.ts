import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema } from './schemas';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { RobotViewerComponent, CapabilitiesViewerComponent } from './team-viewer';

export const Game2025: GameConfig = {
  year: '2025',
  name: 'Reefscape',
  pitScout: {
    robotSchema,
    capabilitiesSchema,
    RobotComponent: PitScoutRobot,
    CapabilitiesComponent: PitScoutCapabilities,
    RobotViewerComponent,
    CapabilitiesViewerComponent,
  },
};
