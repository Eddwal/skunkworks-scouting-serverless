'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MatchSelect } from '@/components/ui/match-select';
import { TeamSelect } from '@/components/ui/team-select';
import { ScoutingEvent } from '@/hooks/use-event';
import { useScouts } from '@/hooks/use-scouts';
import { Badge } from '@/components/ui/badge';

interface SetupStepProps {
  control: any;
  errors: any;
  activeEvent: ScoutingEvent | null;
  watchEventId: string;
  teams: string[];
  scheduledTeams: string[];
  watchIsSubstitute: boolean;
  matches: any[];
}

export function SetupStep({ control, errors, activeEvent, watchEventId, teams, scheduledTeams, watchIsSubstitute, matches }: SetupStepProps) {
  const { activeScout } = useScouts();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Event & Scout</Label>
        <div className="flex items-center gap-2 text-lg font-medium flex-wrap">
          <span>{activeEvent ? activeEvent.name : 'No event selected'}</span>
          {activeScout && (
            <Badge variant="secondary" className="ml-2">
              Scout: {activeScout.name}
            </Badge>
          )}
        </div>
        {errors.eventId && <p className="text-sm text-destructive">{errors.eventId.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Match</Label>
        <Controller
          name="matchSetup.matchKey"
          control={control}
          render={({ field }) => (
            <MatchSelect
              matches={matches}
              value={field.value}
              onValueChange={field.onChange}
              disabled={!watchEventId}
              valueKey="matchKey"
            />
          )}
        />
        {errors.matchSetup?.matchKey && <p className="text-sm text-destructive">{errors.matchSetup.matchKey.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Scheduled Team</Label>
        <Controller
          name="matchSetup.scheduledTeamId"
          control={control}
          render={({ field }) => (
            <TeamSelect
              teams={scheduledTeams}
              value={field.value}
              onValueChange={field.onChange}
              disabled={!watchEventId}
              placeholder={scheduledTeams.length === 0 ? 'Select a match first' : 'Select a team'}
            />
          )}
        />
        {errors.matchSetup?.scheduledTeamId && <p className="text-sm text-destructive">{errors.matchSetup.scheduledTeamId.message as string}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="matchSetup.isSubstitute"
          control={control}
          render={({ field }) => (
            <Checkbox id="isSubstitute" checked={!!field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="isSubstitute">Substitute?</Label>
      </div>

      {watchIsSubstitute && (
        <div className="space-y-2">
          <Label>Substitute Team</Label>
          <Controller
            name="matchSetup.substituteTeamId"
            control={control}
            render={({ field }) => (
              <TeamSelect
                teams={teams}
                value={field.value}
                onValueChange={field.onChange}
                disabled={!watchEventId}
                placeholder="Select substitute team"
              />
            )}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Controller
          name="matchSetup.noShow"
          control={control}
          render={({ field }) => (
            <Checkbox id="noShow" checked={!!field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="noShow">No Show?</Label>
      </div>
    </div>
  );
}
