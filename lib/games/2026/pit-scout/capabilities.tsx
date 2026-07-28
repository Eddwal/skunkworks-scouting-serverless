'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormComponentProps } from '../../types';
import { CapabilityRow, SectionHeader } from '@/components/pit-scouting/capabilities';
import { BasePitScoutCapabilities } from '@/components/pit-scouting/base-capabilities-form';

export function PitScoutCapabilities(props: FormComponentProps) {
  const { control } = props;
  
  return (
    <BasePitScoutCapabilities {...props}>
      <div className="space-y-3">
        <SectionHeader title="Movement" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Move in Auto" name="capabilities.movement.move" control={control} hasCan={false} />
          <CapabilityRow label="Use Trench" name="capabilities.movement.trench" control={control} hasAuto={false} />
          <CapabilityRow label="Use Bump" name="capabilities.movement.bump" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Shooting" hasAuto={false} />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Can Shoot" name="capabilities.shooting.shoot" control={control} hasAuto={false} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Collection" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Pick Up From Floor" name="capabilities.collection.floor" control={control} hasAuto={false} />
          <CapabilityRow label="Use Depot" name="capabilities.collection.depot" control={control} />
          <CapabilityRow label="Use Chute" name="capabilities.collection.chute" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-primary pt-2 border-b-2 border-primary/20 pb-1">Climbing</h4>
        <div className="bg-muted/20 rounded-md p-4 border border-border/50 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Max Climb Level</Label>
            <Controller
              name="capabilities.climbing.maxLevel"
              control={control}
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={field.onChange} 
                  value={field.value || 'No Climb'}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="No Climb" id="climb-none" className="h-6 w-6" />
                    <Label htmlFor="climb-none" className="text-base">No Climb</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L1" id="climb-l1" className="h-6 w-6" />
                    <Label htmlFor="climb-l1" className="text-base">L1</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L2" id="climb-l2" className="h-6 w-6" />
                    <Label htmlFor="climb-l2" className="text-base">L2</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L3" id="climb-l3" className="h-6 w-6" />
                    <Label htmlFor="climb-l3" className="text-base">L3</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Label className="text-base font-medium">Can Climb in Auto</Label>
            <Controller
              name="capabilities.climbing.autoClimb"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  checked={field.value || false} 
                  onCheckedChange={field.onChange} 
                  className="h-8 w-8 [&>svg]:size-5"
                />
              )}
            />
          </div>
        </div>
      </div>
    </BasePitScoutCapabilities>
  );
}
