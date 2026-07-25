import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { StatWithRank } from '@/components/ui/stat-with-rank';
import { robotSchema, capabilitiesSchema, analyticsSchema } from './schemas';

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

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => (
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
          <CapabilityViewerRow label="Move in Auto" can={data?.movement?.move?.can} auto={data?.movement?.move?.auto} />
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
          <CapabilityViewerRow label="Can Shoot" can={data?.shooting?.shoot?.can} auto={data?.shooting?.shoot?.auto} />
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
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Climbing</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Max Level</span>
            <span className="w-12 text-center">In Auto</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50 px-1">
          <span className="font-medium text-sm">Climb</span>
          <div className="flex items-center space-x-4 w-32 justify-end">
            <div className="flex justify-center w-12 font-semibold text-sm">
              {data?.climbing?.maxLevel || 'N/A'}
            </div>
            <div className="flex justify-center w-12">
              {data?.climbing?.autoClimb !== undefined ? (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${data.climbing.autoClimb ? 'bg-green-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>
                  {data.climbing.autoClimb ? 'Yes' : 'No'}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
);

export const AnalyticsViewerComponent = ({ data, allTeamsData }: { data: z.infer<typeof analyticsSchema>, allTeamsData?: any[] }) => {
  if (!data) return null;
  
  const getValues = (key: string) => allTeamsData?.map(t => t.analytics?.[key]).filter(v => typeof v === 'number') as number[];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 px-1">Fuel Scored</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatWithRank label="Auto" value={data.avgAutoFuelScored} allValues={getValues('avgAutoFuelScored')} />
          <StatWithRank label="Teleop" value={data.avgTeleopFuelScored} allValues={getValues('avgTeleopFuelScored')} />
          <StatWithRank label="Overall" value={data.avgOverallFuelScored} allValues={getValues('avgOverallFuelScored')} />
        </div>
      </div>
    </div>
  );
};
