import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema, autoSchema, teleopSchema, endgameSchema, analyticsSchema } from './schemas';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent, AnalyticsViewerComponent } from './team-viewer';
import { processAnalytics } from './analytics';

export const Game2026: GameConfig = {
  year: '2026',
  name: 'Rebuilt',
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
    AnalyticsViewerComponent,
  },
};
