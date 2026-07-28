'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormComponentProps } from '@/lib/games/types';

interface DriveTrainProps extends FormComponentProps {
  // Base name for the fields, e.g. "robot.driveTrain" or just "robot"
  baseName?: string;
}

export function DriveTrain({ control, errors, baseName = 'robot' }: DriveTrainProps) {
  const driveTypeField = baseName ? `${baseName}.driveType` : 'driveType';
  const driveMotorField = baseName ? `${baseName}.driveMotor` : 'driveMotor';

  // Helper to extract nested errors
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Drive Type</Label>
        <Controller
          name={driveTypeField}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select drive type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Swerve">Swerve</SelectItem>
                <SelectItem value="Tank / West Coast">Tank / West Coast</SelectItem>
                <SelectItem value="Mecanum">Mecanum</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {getError(driveTypeField) && (
          <p className="text-sm text-destructive">{getError(driveTypeField) as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Drive Motor</Label>
        <Controller
          name={driveMotorField}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select motor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kraken X60">Kraken X60</SelectItem>
                <SelectItem value="Falcon 500">Falcon 500</SelectItem>
                <SelectItem value="NEO">NEO</SelectItem>
                <SelectItem value="NEO Vortex">NEO Vortex</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {getError(driveMotorField) && (
          <p className="text-sm text-destructive">{getError(driveMotorField) as string}</p>
        )}
      </div>
    </div>
  );
}
