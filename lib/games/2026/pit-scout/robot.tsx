import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from '../../types';
import { BasePitScoutRobot } from '@/components/pit-scouting/base-robot-form';

export function PitScoutRobot(props: FormComponentProps) {
  const { control, errors } = props;
  
  return (
    <BasePitScoutRobot {...props} yearSpecificTitle="2026 Specifics">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="robot.hopperCapacity" className="text-base font-medium">Hopper Capacity</Label>
          <Input 
            id="robot.hopperCapacity"
            type="number" 
            placeholder="Max number of fuel"
            {...control.register('robot.hopperCapacity')} 
          />
          {(errors.robot as any)?.hopperCapacity && <p className="text-sm text-destructive">{(errors.robot as any).hopperCapacity.message as string}</p>}
        </div>
      </div>
    </BasePitScoutRobot>
  );
}
