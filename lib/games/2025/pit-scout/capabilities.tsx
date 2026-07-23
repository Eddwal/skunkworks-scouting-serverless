import { FormComponentProps } from '../../types';
import { CapabilityRow, SectionHeader } from '@/components/pit-scouting/capabilities';
import { BasePitScoutCapabilities } from '@/components/pit-scouting/base-capabilities-form';

export function PitScoutCapabilities(props: FormComponentProps) {
  const { control } = props;
  
  return (
    <BasePitScoutCapabilities {...props}>
      <div className="space-y-3">
        <SectionHeader title="Coral Scoring" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="L1 (Trough)" name="capabilities.coralL1" control={control} />
          <CapabilityRow label="L2 (Branches)" name="capabilities.coralL2" control={control} />
          <CapabilityRow label="L3 (Branches)" name="capabilities.coralL3" control={control} />
          <CapabilityRow label="L4 (Branches)" name="capabilities.coralL4" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Algae Scoring" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Processor" name="capabilities.algaeProcessor" control={control} />
          <CapabilityRow label="Net" name="capabilities.algaeNet" control={control} />
        </div>
      </div>
    </BasePitScoutCapabilities>
  );
}
