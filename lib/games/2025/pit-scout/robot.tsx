'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from '../../types';
import { BasePitScoutRobot } from '@/components/pit-scouting/base-robot-form';

export function PitScoutRobot(props: FormComponentProps) {
  const { control, errors } = props;
  
  return (
    <BasePitScoutRobot {...props} yearSpecificTitle="2025 Specifics">
      {/* Add year specific form fields here */}
    </BasePitScoutRobot>
  );
}
