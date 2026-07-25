import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseAutoForm } from '@/components/match-scouting/base-auto-form';
import { Stepper } from '@/components/ui/stepper';

export function MatchScoutAuto(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseAutoForm {...props} yearSpecificTitle="2025 Auto">
      <div className="grid grid-cols-2 gap-4">
        <Controller name="auto.coralL4" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L4" />
        )} />
        <Controller name="auto.coralL3" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L3" />
        )} />
        <Controller name="auto.coralL2" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L2" />
        )} />
        <Controller name="auto.coralL1" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L1" />
        )} />
      </div>
    </BaseAutoForm>
  );
}
