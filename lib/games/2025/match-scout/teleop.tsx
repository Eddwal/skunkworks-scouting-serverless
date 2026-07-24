import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseTeleopForm } from '@/components/match-scouting/base-teleop-form';

export function MatchScoutTeleop(props: FormComponentProps) {
  return (
    <BaseTeleopForm {...props} yearSpecificTitle="2025 Teleop">
      {/* Add year specific teleop fields here */}
    </BaseTeleopForm>
  );
}
