import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { StatWithRank } from '@/components/ui/stat-with-rank';
import { robotSchema, capabilitiesSchema, analyticsSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => null;

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
          <CapabilityViewerRow label="Place L4" can={data?.coralL4?.can} auto={data?.coralL4?.auto} />
          <CapabilityViewerRow label="Place L3" can={data?.coralL3?.can} auto={data?.coralL3?.auto} />
          <CapabilityViewerRow label="Place L2" can={data?.coralL2?.can} auto={data?.coralL2?.auto} />
          <CapabilityViewerRow label="Place L1" can={data?.coralL1?.can} auto={data?.coralL1?.auto} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pb-1 border-b-2 border-primary/20 mb-2 px-1">
          <h4 className="font-semibold text-primary">Climbing</h4>
          <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
            <span className="w-12 text-center">Can</span>
          </div>
        </div>
        <div className="px-1">
          <CapabilityViewerRow label="Deep Climb" can={data?.deepClimb?.can} hasAuto={false} />
          <CapabilityViewerRow label="Shallow Climb" can={data?.shallowClimb?.can} hasAuto={false} />
        </div>
      </div>

    </div>
  );
};

export const AnalyticsViewerComponent = ({ data, allTeamsData }: { data: z.infer<typeof analyticsSchema>, allTeamsData?: any[] }) => {
  if (!data) return null;

  const getValues = (key: string) => allTeamsData?.map(t => t.analytics?.[key]).filter(v => typeof v === 'number') as number[];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 px-1">Coral L4</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatWithRank label="Auto" value={data.avgAutoCoralL4} allValues={getValues('avgAutoCoralL4')} />
          <StatWithRank label="Teleop" value={data.avgTeleopCoralL4} allValues={getValues('avgTeleopCoralL4')} />
          <StatWithRank label="Overall" value={data.avgOverallCoralL4} allValues={getValues('avgOverallCoralL4')} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 px-1">Coral L3</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatWithRank label="Auto" value={data.avgAutoCoralL3} allValues={getValues('avgAutoCoralL3')} />
          <StatWithRank label="Teleop" value={data.avgTeleopCoralL3} allValues={getValues('avgTeleopCoralL3')} />
          <StatWithRank label="Overall" value={data.avgOverallCoralL3} allValues={getValues('avgOverallCoralL3')} />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 px-1">Coral L2</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatWithRank label="Auto" value={data.avgAutoCoralL2} allValues={getValues('avgAutoCoralL2')} />
          <StatWithRank label="Teleop" value={data.avgTeleopCoralL2} allValues={getValues('avgTeleopCoralL2')} />
          <StatWithRank label="Overall" value={data.avgOverallCoralL2} allValues={getValues('avgOverallCoralL2')} />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary pb-1 border-b-2 border-primary/20 px-1">Coral L1</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatWithRank label="Auto" value={data.avgAutoCoralL1} allValues={getValues('avgAutoCoralL1')} />
          <StatWithRank label="Teleop" value={data.avgTeleopCoralL1} allValues={getValues('avgTeleopCoralL1')} />
          <StatWithRank label="Overall" value={data.avgOverallCoralL1} allValues={getValues('avgOverallCoralL1')} />
        </div>
      </div>
    </div>
  );
};
