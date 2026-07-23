import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { FormComponentProps, PitScoutConfig } from '../types';
import { driveTrainSchema, dimensionsSchema } from '@/components/pit-scouting/schemas';
import { DriveTrain } from '@/components/pit-scouting/drive-train';
import { Dimensions } from '@/components/pit-scouting/dimensions';

export const robotSchema = dimensionsSchema.merge(driveTrainSchema).extend({
  hopperCapacity: z.coerce.number({ message: "Hopper Capacity must be a valid number" }).min(0, "Hopper capacity cannot be negative"),
});

const capRowSchema = z.object({
  can: z.boolean().default(false),
  auto: z.boolean().default(false)
});

export const capabilitiesSchema = z.object({
  coralL1: capRowSchema.default({ can: false, auto: false }),
  coralL2: capRowSchema.default({ can: false, auto: false }),
  coralL3: capRowSchema.default({ can: false, auto: false }),
  coralL4: capRowSchema.default({ can: false, auto: false }),
  algaeProcessor: capRowSchema.default({ can: false, auto: false }),
  algaeNet: capRowSchema.default({ can: false, auto: false }),
  autoDescription: z.string().default(''),
  notes: z.string().default(''),
});

export function PitScoutRobot({ control, errors, register, setValue, watch }: FormComponentProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Dimensions & Weight</h3>
        <Dimensions control={control} errors={errors} register={register} setValue={setValue} watch={watch} baseName="robot" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Drivetrain</h3>
        <DriveTrain control={control} errors={errors} register={register} setValue={setValue} watch={watch} baseName="robot" />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">2025 Specifics</h3>
        <div className="space-y-2">
          <Label>Hopper Capacity</Label>
          <Controller
            name="robot.hopperCapacity"
            control={control}
            render={({ field }) => <Input type="number" inputMode="decimal" {...field} value={field.value ?? ''} />}
          />
          {(errors?.robot as any)?.hopperCapacity && <p className="text-sm text-destructive">{(errors.robot as any).hopperCapacity.message as string}</p>}
        </div>
      </div>
    </div>
  );
}

function CapabilityRow({ label, name, control, hasAuto = true }: { label: string, name: string, control: any, hasAuto?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_4rem_4rem] gap-2 items-center py-4 border-b last:border-0 border-border/50">
      <span className="font-medium text-base">{label}</span>
      <div className="flex justify-center w-full">
        <Controller
          name={`${name}.can`}
          control={control}
          render={({ field }) => <Checkbox className="h-8 w-8 [&>svg]:size-5" checked={field.value || false} onCheckedChange={field.onChange} />}
        />
      </div>
      <div className="flex justify-center w-full">
        {hasAuto && (
          <Controller
            name={`${name}.auto`}
            control={control}
            render={({ field }) => <Checkbox className="h-8 w-8 [&>svg]:size-5" checked={field.value || false} onCheckedChange={field.onChange} />}
          />
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, hasAuto = true }: { title: string, hasAuto?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_4rem_4rem] gap-2 items-center pt-2 pb-1 border-b-2 border-primary/20 px-3">
      <h4 className="font-semibold text-primary">{title}</h4>
      <span className="text-xs font-semibold text-muted-foreground uppercase text-center w-full">Can</span>
      <span className="text-xs font-semibold text-muted-foreground uppercase text-center w-full">{hasAuto ? 'In Auto' : ''}</span>
    </div>
  );
}

export function PitScoutCapabilities({ control }: FormComponentProps) {
  return (
    <div className="space-y-6">
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

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label className="text-base font-medium">Auto Description</Label>
          <Controller
            name="capabilities.autoDescription"
            control={control}
            render={({ field }) => (
              <Textarea 
                placeholder="Describe the auto routine (e.g. Scores 2 corals, leaves start zone...)" 
                className="min-h-[100px]"
                {...field} 
                value={field.value || ''} 
              />
            )}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-base font-medium">Additional Notes</Label>
          <Controller
            name="capabilities.notes"
            control={control}
            render={({ field }) => (
              <Textarea 
                placeholder="Any additional capability notes..." 
                className="min-h-[100px]"
                {...field} 
                value={field.value || ''} 
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export const pitScout: PitScoutConfig = {
  robotSchema,
  capabilitiesSchema,
  RobotComponent: PitScoutRobot,
  CapabilitiesComponent: PitScoutCapabilities,
  RobotViewerComponent: ({ data }) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Hopper Capacity</p>
        <p className="font-medium">{data?.hopperCapacity ?? 'N/A'}</p>
      </div>
    </div>
  ),
  CapabilitiesViewerComponent: ({ data }) => {
    const YesNoBadge = ({ val }: { val: boolean }) => (
      <Badge variant={val ? "default" : "secondary"} className={val ? "bg-green-600 hover:bg-green-700" : ""}>
        {val ? <CheckIcon className="mr-1 size-3" /> : <XIcon className="mr-1 size-3" />}
        {val ? 'Yes' : 'No'}
      </Badge>
    );

    const Row = ({ label, can, auto }: { label: string, can?: boolean, auto?: boolean }) => (
      <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
        <span className="font-medium text-sm">{label}</span>
        <div className="flex items-center space-x-4 w-32 justify-end">
          {can !== undefined && (
            <div className="flex justify-center w-12"><YesNoBadge val={can} /></div>
          )}
          {auto !== undefined && (
            <div className="flex justify-center w-12"><YesNoBadge val={auto} /></div>
          )}
        </div>
      </div>
    );

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
            <Row label="L1 (Trough)" can={data?.coralL1?.can} auto={data?.coralL1?.auto} />
            <Row label="L2 (Branches)" can={data?.coralL2?.can} auto={data?.coralL2?.auto} />
            <Row label="L3 (Branches)" can={data?.coralL3?.can} auto={data?.coralL3?.auto} />
            <Row label="L4 (Branches)" can={data?.coralL4?.can} auto={data?.coralL4?.auto} />
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
            <Row label="Processor" can={data?.algaeProcessor?.can} auto={data?.algaeProcessor?.auto} />
            <Row label="Net" can={data?.algaeNet?.can} auto={data?.algaeNet?.auto} />
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
  }
};
