import { GameConfig } from '../types';
import { robotSchema, capabilitiesSchema, autoSchema, teleopSchema, endgameSchema } from './schemas';
import { PitScoutRobot } from './pit-scout/robot';
import { PitScoutCapabilities } from './pit-scout/capabilities';
import { MatchScoutAuto } from './match-scout/auto';
import { MatchScoutTeleop } from './match-scout/teleop';
import { MatchScoutEndgame } from './match-scout/endgame';
import { RobotViewerComponent, CapabilitiesViewerComponent } from './team-viewer';

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
    AutoComponent: MatchScoutAuto,
    TeleopComponent: MatchScoutTeleop,
    EndgameComponent: MatchScoutEndgame,
  },
};
