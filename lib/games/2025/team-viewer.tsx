import { z } from 'zod';
import { CapabilityViewerRow } from '@/components/pit-scouting/capabilities';
import { StatWithRank } from '@/components/ui/stat-with-rank';
import { robotSchema, capabilitiesSchema, analyticsSchema } from './schemas';

export const RobotViewerComponent = ({ data }: { data: z.infer<typeof robotSchema> }) => null;

export const CapabilitiesViewerComponent = ({ data }: { data: z.infer<typeof capabilitiesSchema> }) => {
  return (
    <div className="space-y-6">
      {/* Add year specific capability viewer rows here */}
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
