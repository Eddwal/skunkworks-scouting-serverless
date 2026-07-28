'use client';

import { Label } from '@/components/ui/label';

interface ReviewStepProps {
  formData: any;
  photoPreview: string | null;
  eventName: string;
}

export function ReviewStep({ formData, photoPreview, eventName }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Review Scouting Data</h3>
      
      <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Event</Label>
            <p className="font-medium">{eventName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Team</Label>
            <p className="font-medium">{formData.teamId || 'Not selected'}</p>
          </div>
        </div>
      </div>

      {photoPreview && (
        <div className="space-y-2">
          <Label className="text-muted-foreground">Robot Photo</Label>
          <div className="border rounded overflow-hidden flex justify-center bg-muted/30 p-2">
            <img src={photoPreview} alt="Robot preview" className="max-h-64 object-contain rounded" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-muted-foreground">Raw Form Data</Label>
        <pre className="p-4 bg-muted/50 rounded-lg text-xs overflow-auto max-h-64">
          {JSON.stringify(
            {
              robot: formData.robot,
              capabilities: formData.capabilities,
            },
            null,
            2
          )}
        </pre>
      </div>
      
      <div className="bg-primary/10 text-primary p-3 rounded text-sm">
        Clicking &quot;Submit&quot; will upload the photo and save all data to the database.
      </div>
    </div>
  );
}
