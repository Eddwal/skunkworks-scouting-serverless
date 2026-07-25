import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseAutoForm } from '@/components/match-scouting/base-auto-form';
import { Stepper } from '@/components/ui/stepper';

export function MatchScoutAuto(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseAutoForm {...props}>
      <div className="pt-4 space-y-4">
        <Controller name="auto.fuelScored" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Fuel Scored" />
        )} />
      </div>
    </BaseAutoForm>
  );
}
