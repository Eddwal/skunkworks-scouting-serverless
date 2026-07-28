'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MatchSelect } from '@/components/ui/match-select';
import { formatMatchName } from '@/lib/utils';
import { ScoutingEvent } from '@/hooks/use-event';

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
            <Select onValueChange={field.onChange} value={field.value as any} disabled={!watchEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {scheduledTeams.length > 0 ? (
                  scheduledTeams.map(team => {
                    return <SelectItem key={team} value={team}>{team}</SelectItem>;
                  })
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">Select a match first</div>
                )}
              </SelectContent>
            </Select>
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
              <Select onValueChange={field.onChange} value={field.value as any} disabled={!watchEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select substitute team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => {
                    return <SelectItem key={team} value={team}>{team}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
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
