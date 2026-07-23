import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

const canOnlySchema = z.object({
  can: z.boolean().default(false)
});

export const capabilitiesSchema = z.object({
  movement: z.object({
    move: capRowSchema.default({ can: false, auto: false }),
    trench: canOnlySchema.default({ can: false }),
    bump: capRowSchema.default({ can: false, auto: false }),
  }),
  shooting: z.object({
    shoot: capRowSchema.default({ can: false, auto: false }),
  }),
  collection: z.object({
    floor: canOnlySchema.default({ can: false }),
    depot: capRowSchema.default({ can: false, auto: false }),
    chute: capRowSchema.default({ can: false, auto: false }),
  }),
  climbing: z.object({
    maxLevel: z.enum(['No Climb', 'L1', 'L2', 'L3']).default('No Climb'),
    autoClimb: z.boolean().default(false),
  }),
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
        <h3 className="text-lg font-medium border-b pb-2">2026 Specifics</h3>
        <div className="space-y-2">
          <Label>Hopper Capacity (Fuel)</Label>
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
        <SectionHeader title="Movement" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Move in Auto" name="capabilities.movement.move" control={control} />
          <CapabilityRow label="Use Trench" name="capabilities.movement.trench" control={control} hasAuto={false} />
          <CapabilityRow label="Use Bump" name="capabilities.movement.bump" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Shooting" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Can Shoot in Auto" name="capabilities.shooting.shoot" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Collection" />
        <div className="bg-muted/20 rounded-md px-3 border border-border/50">
          <CapabilityRow label="Pick Up From Floor" name="capabilities.collection.floor" control={control} hasAuto={false} />
          <CapabilityRow label="Use Depot" name="capabilities.collection.depot" control={control} />
          <CapabilityRow label="Use Chute" name="capabilities.collection.chute" control={control} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-primary pt-2 border-b-2 border-primary/20 pb-1">Climbing</h4>
        <div className="bg-muted/20 rounded-md p-4 border border-border/50 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Max Climb Level</Label>
            <Controller
              name="capabilities.climbing.maxLevel"
              control={control}
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={field.onChange} 
                  value={field.value || 'No Climb'}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="No Climb" id="climb-none" className="h-6 w-6" />
                    <Label htmlFor="climb-none" className="text-base">No Climb</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L1" id="climb-l1" className="h-6 w-6" />
                    <Label htmlFor="climb-l1" className="text-base">L1</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L2" id="climb-l2" className="h-6 w-6" />
                    <Label htmlFor="climb-l2" className="text-base">L2</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="L3" id="climb-l3" className="h-6 w-6" />
                    <Label htmlFor="climb-l3" className="text-base">L3</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Label className="text-base font-medium">Can Climb in Auto</Label>
            <Controller
              name="capabilities.climbing.autoClimb"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  checked={field.value || false} 
                  onCheckedChange={field.onChange} 
                  className="h-8 w-8 [&>svg]:size-5"
                />
              )}
            />
          </div>
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
                placeholder="Describe the auto routine (e.g. Starts at position B, shoots 2 balls, drives to trench...)" 
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
        <p className="text-sm font-medium text-muted-foreground">Hopper Capacity (Fuel)</p>
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
            <h4 className="font-semibold text-primary">Movement</h4>
            <div className="flex items-center space-x-4 w-32 justify-end text-[10px] font-semibold text-muted-foreground uppercase">
              <span className="w-12 text-center">Can</span>
              <span className="w-12 text-center">In Auto</span>
            </div>
          </div>
          <div className="px-1">
            <Row label="Move" can={data?.movement?.move?.can} auto={data?.movement?.move?.auto} />
            <Row label="Use Trench" can={data?.movement?.trench?.can} />
            <Row label="Use Bump" can={data?.movement?.bump?.can} auto={data?.movement?.bump?.auto} />
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
            <Row label="Shoot" can={data?.shooting?.shoot?.can} auto={data?.shooting?.shoot?.auto} />
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
            <Row label="Pick Up From Floor" can={data?.collection?.floor?.can} />
            <Row label="Use Depot" can={data?.collection?.depot?.can} auto={data?.collection?.depot?.auto} />
            <Row label="Use Chute" can={data?.collection?.chute?.can} auto={data?.collection?.chute?.auto} />
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
  }
};
