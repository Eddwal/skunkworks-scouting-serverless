'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewStepProps {
  formData: any;
  eventName: string;
}

export function ReviewStep({ formData, eventName }: ReviewStepProps) {
  const { matchSetup, auto, teleop, endgame } = formData;
  const dbTeamId = formData.teamId;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-semibold">Event:</span>
            <span>{eventName}</span>
            
            <span className="font-semibold">Match Number:</span>
            <span>{matchSetup?.matchNumber}</span>
            
            <span className="font-semibold">Team:</span>
            <span>{dbTeamId}</span>
            
            <span className="font-semibold">No Show:</span>
            <span>{matchSetup?.noShow ? 'Yes' : 'No'}</span>
            
            {matchSetup?.isSubstitute && (
              <>
                <span className="font-semibold text-amber-500">Substitute Team:</span>
                <span className="text-amber-500">{matchSetup.substituteTeamId}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Penalties & Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2 flex-wrap">
            {auto?.majorFouls > 0 && <Badge variant="destructive">Auto Major Fouls: {auto.majorFouls}</Badge>}
            {auto?.minorFouls > 0 && <Badge variant="secondary">Auto Minor Fouls: {auto.minorFouls}</Badge>}
            {teleop?.majorFouls > 0 && <Badge variant="destructive">Teleop Major Fouls: {teleop.majorFouls}</Badge>}
            {teleop?.minorFouls > 0 && <Badge variant="secondary">Teleop Minor Fouls: {teleop.minorFouls}</Badge>}
            {endgame?.yellowCard && <Badge className="bg-yellow-500 hover:bg-yellow-600">Yellow Card</Badge>}
            {endgame?.redCard && <Badge variant="destructive">Red Card</Badge>}
            {(!auto?.majorFouls && !auto?.minorFouls && !teleop?.majorFouls && !teleop?.minorFouls && !endgame?.yellowCard && !endgame?.redCard) && (
              <span className="text-muted-foreground">Clean match (No penalties)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {endgame?.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{endgame.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="bg-muted p-4 rounded-lg text-center text-sm">
        Review the details above. Click Submit to save to the database.
      </div>
    </div>
  );
}
