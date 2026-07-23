import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { CapabilityViewerRow, YesNoBadge } from '@/components/pit-scouting/capabilities';
import { robotSchema, capabilitiesSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-sm font-medium text-muted-foreground">Hopper Capacity (Fuel)</p>
      <p className="font-medium">{data?.hopperCapacity ?? 'N/A'}</p>
    </div>
  </div>
);

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Movement</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="Move" can={data?.movement?.move?.can} auto={data?.movement?.move?.auto} />
          <CapabilityViewerRow label="Use Trench" can={data?.movement?.trench?.can} />
          <CapabilityViewerRow label="Use Bump" can={data?.movement?.bump?.can} auto={data?.movement?.bump?.auto} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Shooting</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="Shoot" can={data?.shooting?.shoot?.can} auto={data?.shooting?.shoot?.auto} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Collection</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="Pick Up From Floor" can={data?.collection?.floor?.can} />
          <CapabilityViewerRow label="Use Depot" can={data?.collection?.depot?.can} auto={data?.collection?.depot?.auto} />
          <CapabilityViewerRow label="Use Chute" can={data?.collection?.chute?.can} auto={data?.collection?.chute?.auto} />
        </div>
      </div>

      <div>
        <div className="pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Climbing</h4>
        </div>
        <div className="px-1 grid grid-cols-2 gap-4 py-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Max Climb Level</p>
            <p className="font-medium mt-1">
              <Badge variant={data?.climbing?.maxLevel === 'No Climb' ? 'secondary' : 'default'}>
                {data?.climbing?.maxLevel || 'No Climb'}
              </Badge>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Climb in Auto</p>
            <div className="mt-1"><YesNoBadge val={data?.climbing?.autoClimb || false} /></div>
          </div>
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

      {data?.notes && (
        <div className="pt-2">
          <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 mb-2 px-1">Additional Notes</h4>
          <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
            {data.notes}
          </div>
        </div>
      )}
    </div>
  );
};
