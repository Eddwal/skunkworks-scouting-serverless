import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseTeleopForm } from '@/components/match-scouting/base-teleop-form';
import { Stepper } from '@/components/ui/stepper';
import { Label } from '@/components/ui/label';

export function MatchScoutTeleop(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseTeleopForm {...props} yearSpecificTitle="2026 Teleop">
      <div className="pt-4 border-t space-y-4">
        <div className="space-y-2">
          <Label>Fuel Scored</Label>
          <Controller name="teleop.fuelScored" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
      </div>
    </BaseTeleopForm>
  );
}
