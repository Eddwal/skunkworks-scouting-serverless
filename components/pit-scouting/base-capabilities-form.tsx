'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormComponentProps } from '@/lib/games/types';

interface BasePitScoutCapabilitiesProps extends FormComponentProps {
  children?: React.ReactNode;
}

export function BasePitScoutCapabilities({ control, children }: BasePitScoutCapabilitiesProps) {
  return (
    <div className="space-y-6">
      {children}

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label className="text-base font-medium">Auto Description</Label>
          <Controller
            name="capabilities.autoDescription"
            control={control}
            render={({ field }) => (
              <Textarea 
                placeholder="Describe the auto routine..." 
                className="min-h-[100px]"
                {...field} 
                value={field.value || ''} 
              />
            )}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-base font-medium">Additional Notes</Label>
          <Controller
            name="capabilities.notes"
            control={control}
            render={({ field }) => (
              <Textarea 
                placeholder="Any additional capability notes..." 
                className="min-h-[100px]"
                {...field} 
                value={field.value || ''} 
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
