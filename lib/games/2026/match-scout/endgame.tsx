import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseEndgameForm } from '@/components/match-scouting/base-endgame-form';

export function MatchScoutEndgame(props: FormComponentProps) {
  return (
    <BaseEndgameForm {...props} yearSpecificTitle="2026 Endgame">
      {/* Add year specific endgame fields here */}
    </BaseEndgameForm>
  );
}
