import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from '@phosphor-icons/react';

export function CapabilityRow({ label, name, control, hasAuto = true }: { label: string, name: string, control: any, hasAuto?: boolean }) {
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

export function SectionHeader({ title, hasAuto = true }: { title: string, hasAuto?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_4rem_4rem] gap-2 items-center pt-2 pb-1 border-b-2 border-primary/20 px-3">
      <h4 className="font-semibold text-primary">{title}</h4>
      <span className="text-xs font-semibold text-muted-foreground uppercase text-center w-full">Can</span>
      <span className="text-xs font-semibold text-muted-foreground uppercase text-center w-full">{hasAuto ? 'In Auto' : ''}</span>
    </div>
  );
}

export const YesNoBadge = ({ val }: { val: boolean }) => (
  <Badge variant={val ? "default" : "secondary"} className={val ? "bg-green-600 hover:bg-green-700" : ""}>
    {val ? <CheckIcon className="mr-1 size-3" /> : <XIcon className="mr-1 size-3" />}
    {val ? 'Yes' : 'No'}
  </Badge>
);

export const CapabilityViewerRow = ({ label, can, auto, hasAuto = true }: { label: string, can?: boolean, auto?: boolean, hasAuto?: boolean }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50 px-1">
    <span className="font-medium text-sm">{label}</span>
    <div className="flex items-center space-x-4 w-32 justify-end">
      <div className="flex justify-center w-12">
        {can !== undefined && <YesNoBadge val={can} />}
      </div>
      {hasAuto && (
        <div className="flex justify-center w-12">
          {auto !== undefined && <YesNoBadge val={auto} />}
        </div>
      )}
      {!hasAuto && <div className="w-12" />}
    </div>
  </div>
);
