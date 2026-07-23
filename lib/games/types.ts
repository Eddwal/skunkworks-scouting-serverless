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
  schema?: z.ZodObject<any>;
  Component?: React.FC<FormComponentProps>;
}

export interface GameConfig {
  year: string;
  name: string;
  
  pitScout: PitScoutConfig;
  matchScout?: MatchScoutConfig;

  DashboardComponent?: React.FC;
}
