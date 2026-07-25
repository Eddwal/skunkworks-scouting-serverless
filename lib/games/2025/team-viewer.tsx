import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema, analyticsSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => null;

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      {/* Add year specific capability viewer rows here */}
    </div>
  );
};

export const AnalyticsViewerComponent = ({ data }: { data: z.infer<typeof analyticsSchema> }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Avg Coral L4</span>
        <span className="text-2xl font-bold">{data.avgCoralL4?.toFixed(1) || '0.0'}</span>
      </div>
      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Avg Coral L3</span>
        <span className="text-2xl font-bold">{data.avgCoralL3?.toFixed(1) || '0.0'}</span>
      </div>
      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Avg Coral L2</span>
        <span className="text-2xl font-bold">{data.avgCoralL2?.toFixed(1) || '0.0'}</span>
      </div>
      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Avg Coral L1</span>
        <span className="text-2xl font-bold">{data.avgCoralL1?.toFixed(1) || '0.0'}</span>
      </div>
    </div>
  );
};
