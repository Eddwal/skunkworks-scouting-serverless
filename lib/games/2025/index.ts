import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema, autoSchema, teleopSchema, endgameSchema, analyticsSchema } from './schemas';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent, AnalyticsViewerComponent } from './team-viewer';
import { processAnalytics } from './analytics';

import { ReefscapeStats } from './pre-match/stats';
import { ReefscapeCapabilitiesBadge } from './pre-match/capabilities-badge';

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
  preMatch: {
    StatsComponent: ReefscapeStats,
    CapabilitiesBadgeComponent: ReefscapeCapabilitiesBadge,
    radarMetrics: [
      { key: "avgOverallCoralL1", label: "Coral L1" },
      { key: "avgOverallCoralL2", label: "Coral L2" },
      { key: "avgOverallCoralL3", label: "Coral L3" },
      { key: "avgOverallCoralL4", label: "Coral L4" },
      { key: "totalDeepClimbs", label: "Deep Climb" },
      { key: "totalShallowClimbs", label: "Shallow Climb" },
    ],
  },
};
