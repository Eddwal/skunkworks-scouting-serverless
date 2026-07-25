import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseAutoForm } from '@/components/match-scouting/base-auto-form';
import { Stepper } from '@/components/ui/stepper';
import { Label } from '@/components/ui/label';

export function MatchScoutAuto(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseAutoForm {...props} yearSpecificTitle="2026 Auto">
      <div className="pt-4 border-t space-y-4">
        <div className="space-y-2">
          <Label>Fuel Scored</Label>
          <Controller name="auto.fuelScored" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
      </div>
    </BaseAutoForm>
  );
}
