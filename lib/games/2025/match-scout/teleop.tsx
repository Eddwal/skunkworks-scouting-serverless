import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseTeleopForm } from '@/components/match-scouting/base-teleop-form';
import { Stepper } from '@/components/ui/stepper';

export function MatchScoutTeleop(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseTeleopForm {...props} yearSpecificTitle="2025 Teleop">
      <div className="grid grid-cols-2 gap-4">
        <Controller name="teleop.coralL4" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L4" />
        )} />
        <Controller name="teleop.coralL3" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L3" />
        )} />
        <Controller name="teleop.coralL2" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L2" />
        )} />
        <Controller name="teleop.coralL1" control={control} render={({ field }) => (
          <Stepper value={field.value} onChange={field.onChange} min={0} label="Coral L1" />
        )} />
      </div>
    </BaseTeleopForm>
  );
}
