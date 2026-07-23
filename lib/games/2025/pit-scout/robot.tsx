import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from '../../types';
import { BasePitScoutRobot } from '@/components/pit-scouting/base-robot-form';

export function PitScoutRobot(props: FormComponentProps) {
  const { control, errors } = props;
  
  return (
    <BasePitScoutRobot {...props} yearSpecificTitle="2025 Specifics">
      <div className="space-y-2">
        <Label>Hopper Capacity</Label>
        <Controller
          name="robot.hopperCapacity"
          control={control}
          render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value ?? ''} />}
        />
        {(errors?.robot as any)?.hopperCapacity && <p className="text-sm text-destructive">{(errors.robot as any).hopperCapacity.message as string}</p>}
      </div>
    </BasePitScoutRobot>
  );
}
