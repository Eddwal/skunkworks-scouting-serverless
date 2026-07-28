'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { TeamSelect } from '@/components/ui/team-select';
import { ScoutingEvent } from '@/hooks/use-event';

interface SetupStepProps {
  control: any;
  errors: any;
  activeEvent: ScoutingEvent | null;
  watchEventId: string;
  teams: string[];
}

export function SetupStep({ control, errors, activeEvent, watchEventId, teams }: SetupStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Event</Label>
        <div className="text-lg font-medium">
          {activeEvent ? activeEvent.name : 'No event selected'}
        </div>
        {errors.eventId && <p className="text-sm text-destructive">{errors.eventId.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Team</Label>
        <Controller
          name="teamId"
          control={control}
          render={({ field }) => (
            <TeamSelect
              teams={teams}
              value={field.value}
              onValueChange={field.onChange}
              disabled={!watchEventId}
            />
          )}
        />
        {errors.teamId && <p className="text-sm text-destructive">{errors.teamId.message as string}</p>}
      </div>
    </div>
  );
}
