import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Stepper } from '@/components/ui/stepper';
import { FormComponentProps } from '@/lib/games/types';

interface BaseTeleopFormProps extends FormComponentProps {
  children?: ReactNode;
  yearSpecificTitle?: string;
}

export function BaseTeleopForm({ control, children }: BaseTeleopFormProps) {
  return (
    <div className="space-y-6">
      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      <div className="pt-4 border-t space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="teleop.majorFouls"
            control={control}
            render={({ field }) => (
              <Stepper value={field.value} onChange={field.onChange} min={0} label="Major Fouls" />
            )}
          />
          <Controller
            name="teleop.minorFouls"
            control={control}
            render={({ field }) => (
              <Stepper value={field.value} onChange={field.onChange} min={0} label="Minor Fouls" />
            )}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Controller
          name="teleop.deadInTheWater"
          control={control}
          render={({ field }) => (
            <Checkbox id="teleop-dead" checked={!!field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="teleop-dead">Dead in the Water (Teleop)</Label>
      </div>
    </div>
  );
}
