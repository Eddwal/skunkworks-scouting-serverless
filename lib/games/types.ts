import { z } from 'zod';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

export interface FormComponentProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export interface PitScoutConfig {
  robotSchema: z.ZodObject<any>;
  capabilitiesSchema: z.ZodObject<any>;
  RobotComponent: React.FC<FormComponentProps>;
  CapabilitiesComponent: React.FC<FormComponentProps>;
  RobotViewerComponent?: React.FC<{ data: any }>;
  CapabilitiesViewerComponent?: React.FC<{ data: any }>;
}

export interface MatchScoutConfig {
  autoSchema: z.ZodObject<any>;
  teleopSchema: z.ZodType<any, any, any>;
  endgameSchema: z.ZodType<any, any, any>;

  AutoComponent: React.ComponentType<FormComponentProps>;
  TeleopComponent: React.ComponentType<FormComponentProps>;
  EndgameComponent: React.ComponentType<FormComponentProps>;
  AnalyticsViewerComponent?: React.ComponentType<{ data: any; allTeamsData?: any[]; context?: string }>;
  analyticsSchema?: z.ZodType<any, any, any>;
  processAnalytics?: (currentAnalytics: any, matchData: any) => any;
}

import { TeamData } from '@/lib/firebase/converters';

export interface StandingsData {
  teamId: string;
  rank?: number;
  total: number;
  [key: string]: any; // Allow arbitrary keys for game segments
}

export interface StandingsConfig {
  calculateStandings: (teams: (TeamData & { id: string })[]) => StandingsData[];
}

export interface MatchPoints {
  matchKey: string;
  auto: number;
  teleop: number;
  endgame: number;
  total: number;
}

export interface PreMatchConfig {
  StatsComponent?: React.ComponentType<{ 
    teamData?: TeamData; 
    allTeams: Record<string, TeamData>;
  }>;
  CapabilitiesBadgeComponent?: React.ComponentType<{ 
    capabilities?: any;
  }>;
  radarMetrics?: { key: string; label: string }[];
}

export interface GameConfig {
  year: string;
  name: string;
  
  pitScout: PitScoutConfig;
  matchScout?: MatchScoutConfig;
  standings?: StandingsConfig;
  preMatch?: PreMatchConfig;
  calculateMatchPoints?: (matchData: any) => MatchPoints;
}
