'use client';

import { FormComponentProps } from '../../types';
import { CapabilityRow, SectionHeader } from '@/components/pit-scouting/capabilities';
import { BasePitScoutCapabilities } from '@/components/pit-scouting/base-capabilities-form';

export function PitScoutCapabilities(props: FormComponentProps) {
  const { control } = props;
  
  return (
    <BasePitScoutCapabilities {...props}>
      <div className="space-y-4">
        <div>
          <SectionHeader title="Coral Scoring" />
          <div className="px-3">
            <CapabilityRow label="Place L4" name="capabilities.coralL4" control={control} />
            <CapabilityRow label="Place L3" name="capabilities.coralL3" control={control} />
            <CapabilityRow label="Place L2" name="capabilities.coralL2" control={control} />
            <CapabilityRow label="Place L1" name="capabilities.coralL1" control={control} />
          </div>
        </div>

        <div>
          <SectionHeader title="Climbing" hasAuto={false} />
          <div className="px-3">
            <CapabilityRow label="Deep Climb" name="capabilities.deepClimb" control={control} hasAuto={false} />
            <CapabilityRow label="Shallow Climb" name="capabilities.shallowClimb" control={control} hasAuto={false} />
          </div>
        </div>
      </div>
    </BasePitScoutCapabilities>
  );
}
