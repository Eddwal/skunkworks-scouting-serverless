'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormComponentProps } from '@/lib/games/types';

interface DimensionsProps extends FormComponentProps {
  // Base name for the fields, e.g. "robot"
  baseName?: string;
}

export function Dimensions({ control, errors, baseName = 'robot' }: DimensionsProps) {
  const getField = (name: string) => baseName ? `${baseName}.${name}` : name;
  
  const getError = (fieldName: string) => {
    if (!baseName) return errors[fieldName]?.message;
    const parts = fieldName.split('.');
    let current: any = errors;
    for (const part of parts) {
      if (!current) return undefined;
      current = current[part];
    }
    return current?.message;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label>Length (in)</Label>
        <Controller
          name={getField('length')}
          control={control}
          render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value || ''} />}
        />
        {getError(getField('length')) && (
          <p className="text-sm text-destructive">{getError(getField('length')) as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Width (in)</Label>
        <Controller
          name={getField('width')}
          control={control}
          render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value || ''} />}
        />
        {getError(getField('width')) && (
          <p className="text-sm text-destructive">{getError(getField('width')) as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Height (in)</Label>
        <Controller
          name={getField('height')}
          control={control}
          render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value || ''} />}
        />
        {getError(getField('height')) && (
          <p className="text-sm text-destructive">{getError(getField('height')) as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Weight (lbs)</Label>
        <Controller
          name={getField('weight')}
          control={control}
          render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value || ''} />}
        />
        {getError(getField('weight')) && (
          <p className="text-sm text-destructive">{getError(getField('weight')) as string}</p>
        )}
      </div>
    </div>
  );
}
