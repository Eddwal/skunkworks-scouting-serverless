import React from 'react';
import { FormComponentProps } from '@/lib/games/types';
import { Dimensions } from './dimensions';
import { DriveTrain } from './drive-train';

interface BasePitScoutRobotProps extends FormComponentProps {
  yearSpecificTitle?: string;
  children?: React.ReactNode;
}

export function BasePitScoutRobot({ 
  control, 
  errors, 
  register, 
  setValue, 
  watch,
  yearSpecificTitle = "Year Specifics",
  children
}: BasePitScoutRobotProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Dimensions & Weight</h3>
        <Dimensions control={control} errors={errors} register={register} setValue={setValue} watch={watch} baseName="robot" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Drivetrain</h3>
        <DriveTrain control={control} errors={errors} register={register} setValue={setValue} watch={watch} baseName="robot" />
      </div>
      
      {children && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">{yearSpecificTitle}</h3>
          {children}
        </div>
      )}
    </div>
  );
}
