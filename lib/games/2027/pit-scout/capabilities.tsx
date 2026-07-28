import { Controller } from 'react-hook-form';
import { FormComponentProps } from '../../types';
import { CapabilityRow, SectionHeader } from '@/components/pit-scouting/capabilities';
import { BasePitScoutCapabilities } from '@/components/pit-scouting/base-capabilities-form';

export function PitScoutCapabilities(props: FormComponentProps) {
  const { control } = props;
  
  return (
    <BasePitScoutCapabilities {...props}>
      {/* Add year specific capability fields here */}
    </BasePitScoutCapabilities>
  );
}
