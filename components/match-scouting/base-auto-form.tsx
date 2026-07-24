import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus } from 'lucide-react';
import { FormComponentProps } from '@/lib/games/types';

interface BaseAutoFormProps extends FormComponentProps {
  children?: ReactNode;
  yearSpecificTitle?: string;
}

export function BaseAutoForm({ control, children, yearSpecificTitle }: BaseAutoFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Controller
          name="auto.moved"
          control={control}
          render={({ field }) => (
            <Checkbox id="auto-moved" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="auto-moved">Moved?</Label>
      </div>

      {children && (
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-4">{yearSpecificTitle || 'Year Specific Auto'}</h3>
          {children}
        </div>
      )}

      <div className="pt-4 border-t space-y-4">
        <h3 className="font-semibold">Auto Penalties</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-center">
            <Label>Major Fouls</Label>
            <Controller
              name="auto.majorFouls"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-center space-x-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.max(0, (Number(field.value) || 0) - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-8 text-center">{field.value || 0}</span>
                  <Button type="button" variant="outline" size="icon" onClick={() => field.onChange((Number(field.value) || 0) + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              )}
            />
          </div>
          <div className="space-y-2 text-center">
            <Label>Minor Fouls</Label>
            <Controller
              name="auto.minorFouls"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-center space-x-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.max(0, (Number(field.value) || 0) - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-8 text-center">{field.value || 0}</span>
                  <Button type="button" variant="outline" size="icon" onClick={() => field.onChange((Number(field.value) || 0) + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Controller
          name="auto.deadInTheWater"
          control={control}
          render={({ field }) => (
            <Checkbox id="auto-dead" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="auto-dead">Dead in the Water (Auto)</Label>
      </div>
    </div>
  );
}
