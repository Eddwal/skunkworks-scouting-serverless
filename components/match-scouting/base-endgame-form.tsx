import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormComponentProps } from '@/lib/games/types';

interface BaseEndgameFormProps extends FormComponentProps {
  children?: ReactNode;
  yearSpecificTitle?: string;
}

export function BaseEndgameForm({ control, children, yearSpecificTitle }: BaseEndgameFormProps) {
  return (
    <div className="space-y-6">
      {children && (
        <div className="mb-6">
          <h3 className="font-semibold mb-4">{yearSpecificTitle || 'Year Specific Endgame'}</h3>
          {children}
        </div>
      )}

      <div className="pt-4 border-t space-y-4">
        <h3 className="font-semibold">Cards</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="endgame.yellowCard"
              control={control}
              render={({ field }) => (
                <Checkbox id="yellowCard" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="yellowCard">Yellow Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="endgame.redCard"
              control={control}
              render={({ field }) => (
                <Checkbox id="redCard" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="redCard">Red Card</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Notes</Label>
        <Controller
          name="endgame.notes"
          control={control}
          render={({ field }) => (
            <Textarea 
              placeholder="Any additional notes about the robot's performance..." 
              className="min-h-[100px]"
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
}
