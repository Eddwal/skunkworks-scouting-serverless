import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => (
  <div className="pt-4 border-t">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Hopper Capacity</p>
        <p className="font-medium">{data?.hopperCapacity ?? 'N/A'}</p>
      </div>
    </div>
  </div>
);

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Coral Scoring</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="L1 (Trough)" can={data?.coralL1?.can} auto={data?.coralL1?.auto} />
          <CapabilityViewerRow label="L2 (Branches)" can={data?.coralL2?.can} auto={data?.coralL2?.auto} />
          <CapabilityViewerRow label="L3 (Branches)" can={data?.coralL3?.can} auto={data?.coralL3?.auto} />
          <CapabilityViewerRow label="L4 (Branches)" can={data?.coralL4?.can} auto={data?.coralL4?.auto} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Algae Scoring</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="Processor" can={data?.algaeProcessor?.can} auto={data?.algaeProcessor?.auto} />
          <CapabilityViewerRow label="Net" can={data?.algaeNet?.can} auto={data?.algaeNet?.auto} />
        </div>
      </div>

      {data?.autoDescription && (
        <div className="pt-2">
          <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 mb-2 px-1">Auto Description</h4>
          <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
            {data.autoDescription}
          </div>
        </div>
      )}
    </div>
  );
};
