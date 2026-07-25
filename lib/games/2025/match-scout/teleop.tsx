import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { BaseTeleopForm } from '@/components/match-scouting/base-teleop-form';
import { Stepper } from '@/components/ui/stepper';
import { Label } from '@/components/ui/label';

export function MatchScoutTeleop(props: FormComponentProps) {
  const { control } = props;

  return (
    <BaseTeleopForm {...props} yearSpecificTitle="2025 Teleop">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Coral L4</Label>
          <Controller name="teleop.coralL4" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
        <div className="space-y-2">
          <Label>Coral L3</Label>
          <Controller name="teleop.coralL3" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
        <div className="space-y-2">
          <Label>Coral L2</Label>
          <Controller name="teleop.coralL2" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
        <div className="space-y-2">
          <Label>Coral L1</Label>
          <Controller name="teleop.coralL1" control={control} render={({ field }) => (
            <Stepper value={field.value} onChange={field.onChange} min={0} />
          )} />
        </div>
      </div>
    </BaseTeleopForm>
  );
}
