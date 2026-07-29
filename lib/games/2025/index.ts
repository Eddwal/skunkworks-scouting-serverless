import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema } from './pit-scout/schema';
import { autoSchema, teleopSchema, endgameSchema, analyticsSchema } from './match-scout/schema';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent, AnalyticsViewerComponent } from './team-viewer/components';
import { getAdditionalHeaderStats } from './team-viewer/header-stats';
import { processAnalytics } from './analytics';

import { ReefscapeStats } from './pre-match/stats';
import { ReefscapeCapabilitiesBadge } from './pre-match/capabilities-badge';
import { teamAppendSchema, matchAppendSchema } from './api';

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
  teamViewer: {
    getAdditionalHeaderStats,
  },
  api: {
    teamAppendSchema,
    matchAppendSchema,
  }
};
