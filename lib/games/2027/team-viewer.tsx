import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => (
  <div className="grid grid-cols-2 gap-4">
    {/* Add year specific viewer fields here */}
  </div>
);

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      {/* Add year specific capability viewer rows here */}
    </div>
  );
};
