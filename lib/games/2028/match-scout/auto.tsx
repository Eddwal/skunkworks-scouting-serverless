import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseAutoForm } from '@/components/match-scouting/base-auto-form';

export function MatchScoutAuto(props: FormComponentProps) {
  return (
    <BaseAutoForm {...props} yearSpecificTitle="2028 Auto">
      {/* Add year specific auto fields here */}
    </BaseAutoForm>
  );
}
