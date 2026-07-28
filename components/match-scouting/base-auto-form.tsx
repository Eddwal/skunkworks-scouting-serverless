'use client';

import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Stepper } from '@/components/ui/stepper';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { FormComponentProps } from '@/lib/games/types';

interface BaseAutoFormProps extends FormComponentProps {
  children?: ReactNode;
  yearSpecificTitle?: string;
}

export function BaseAutoForm({ control, children }: BaseAutoFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Controller
            name="auto.moved"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox id="auto-moved" checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true)} />
            )}
          />
          <Label htmlFor="auto-moved">Moved?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Controller
            name="auto.died"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox id="auto-died" checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true)} />
            )}
          />
          <Label htmlFor="auto-died" className="flex items-center gap-1">
            Died
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Moving then died</p>
              </TooltipContent>
            </Tooltip>
          </Label>
        </div>
      </div>

      {children && (
        <div className="pt-4 border-t">
          {children}
        </div>
      )}

      <div className="pt-4 border-t space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="auto.majorFouls"
            control={control}
            render={({ field }) => (
              <Stepper value={field.value} onChange={field.onChange} min={0} label="Major Fouls" />
            )}
          />
          <Controller
            name="auto.minorFouls"
            control={control}
            render={({ field }) => (
              <Stepper value={field.value} onChange={field.onChange} min={0} label="Minor Fouls" />
            )}
          />
        </div>
      </div>

    </div>
  );
}
