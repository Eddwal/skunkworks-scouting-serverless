import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema } from './pit-scout/schema';
import { autoSchema, teleopSchema, endgameSchema, analyticsSchema, AnalyticsData2026 } from './match-scout/schema';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent, AnalyticsViewerComponent } from './team-viewer';
import { processAnalytics, calculateMatchPoints } from './analytics';
import { calculateStandings } from './standings';

import { RebuiltStats } from './pre-match/stats';
import { RebuiltCapabilitiesBadge } from './pre-match/capabilities-badge';

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
  standings: {
    calculateStandings
  },
  preMatch: {
    StatsComponent: RebuiltStats,
    CapabilitiesBadgeComponent: RebuiltCapabilitiesBadge,
    radarMetrics: [
      { key: "avgAutoFuelScored", label: "Auto Fuel" },
      { key: "avgTeleopFuelScored", label: "Teleop Fuel" },
      { key: "avgOverallFuelScored", label: "Total Fuel" },
    ],
  },
  calculateMatchPoints
};
