import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema } from './pit-scout/schema';
import { autoSchema, teleopSchema, endgameSchema, analyticsSchema, AnalyticsData2027 } from './match-scout/schema';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent } from './team-viewer';
import { processAnalytics, calculateMatchPoints } from './analytics';
import { calculateStandings } from './standings';

export const Game2027: GameConfig = {
  year: '2027',
  name: 'Biocore',
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
  calculateMatchPoints
};
