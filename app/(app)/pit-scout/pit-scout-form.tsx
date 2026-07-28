'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db, storage } from '@/lib/firebase/firebase-client';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEvent } from '@/hooks/use-event';
import { getGameConfig, DEFAULT_YEAR } from '@/lib/games';
import { SetupStep } from '@/components/pit-scouting/setup-step';
import { PictureStep } from '@/components/pit-scouting/picture-step';
import { ReviewStep } from '@/components/pit-scouting/review-step';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';

const baseSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  teamId: z.string().min(1, "Team is required"),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

function PitScoutFormContent() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { events, activeEvent } = useEvent();
  
  const year = activeEvent?.id ? activeEvent.id.substring(0, 4) : DEFAULT_YEAR;
  const gameConfig = getGameConfig(year);

  const fullSchema = baseSchema.extend({
    robot: gameConfig.pitScout.robotSchema,
    capabilities: gameConfig.pitScout.capabilitiesSchema,
  });

  const { control, handleSubmit, watch, trigger, formState: { errors }, reset, setValue, register } = useForm({
    resolver: zodResolver(fullSchema),
    shouldUnregister: false,
    defaultValues: {
      eventId: activeEvent?.id || '',
      teamId: '',
      photoUrl: '',
      robot: {},
      capabilities: {},
    }
  });

  const watchEventId = watch('eventId');
  const watchTeamId = watch('teamId');
  const selectedEvent = events.find(e => e.id === watchEventId);
  const teams = selectedEvent?.teams || [];

  useEffect(() => {
    if (activeEvent) {
      setValue('eventId', activeEvent.id);
    }
  }, [activeEvent, setValue]);

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['eventId', 'teamId'];
    if (step === 2) fieldsToValidate = ['robot'];
    if (step === 3) fieldsToValidate = ['capabilities'];
    
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
    }
    
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const onSubmit = async (data: any) => {
    if (step !== 5) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const dbTeamId = data.teamId;
      let uploadedPhotoUrl = data.photoUrl;

      if (photoFile) {
        const fileExtension = photoFile.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `events/${data.eventId}/pitScout/${dbTeamId}.${fileExtension}`);
        
        const snapshot = await uploadBytes(storageRef, photoFile);
        uploadedPhotoUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = doc(db, 'events', data.eventId, 'teams', dbTeamId);
      
      await setDoc(docRef, {
        ...data,
        photoUrl: uploadedPhotoUrl,
        year,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      try {
        const { revalidateDashboards } = await import('@/app/actions/revalidate');
        await revalidateDashboards();
      } catch (error) {
        console.error('Failed to trigger revalidation:', error);
      }
      
      toast.success("Pit scouting data saved successfully!");
      reset();
      setPhotoFile(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      setStep(1);
    } catch (err: any) {
      toast.error(`Error saving data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PitScoutRobot = gameConfig.pitScout.RobotComponent;
  const PitScoutCapabilities = gameConfig.pitScout.CapabilitiesComponent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pit Scouting</CardTitle>
        {step > 1 && watchTeamId && (
          <CardAction>
            <Badge variant="default" className="text-sm px-4 py-1">
              Team {watchTeamId}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex-1 text-center border-b-2 pb-2 ${step >= i ? 'border-primary text-primary font-bold' : 'border-muted text-muted-foreground'}`}>
            <span className="hidden sm:inline">
              {i === 1 && 'Setup'}
              {i === 2 && 'Robot'}
              {i === 3 && 'Capabilities'}
              {i === 4 && 'Picture'}
              {i === 5 && 'Review'}
            </span>
            <span className="sm:hidden">{i}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <SetupStep 
            control={control} 
            errors={errors} 
            activeEvent={activeEvent} 
            watchEventId={watchEventId} 
            teams={teams} 
          />
        )}

        {step === 2 && (
          <PitScoutRobot control={control as any} errors={errors} register={register as any} setValue={setValue as any} watch={watch as any} />
        )}

        {step === 3 && (
          <PitScoutCapabilities control={control as any} errors={errors} register={register as any} setValue={setValue as any} watch={watch as any} />
        )}

        {step === 4 && (
          <PictureStep 
            photoFile={photoFile} 
            setPhotoFile={setPhotoFile} 
            photoPreview={photoPreview} 
            setPhotoPreview={setPhotoPreview} 
          />
        )}

        {step === 5 && (
          <ReviewStep 
            formData={watch()} 
            photoPreview={photoPreview} 
            eventName={activeEvent?.name || 'Unknown Event'} 
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={(e) => { e.preventDefault(); handleBack(); }}>Back</Button>
        ) : <div></div>}
        
        {step < 5 ? (
          <Button type="button" onClick={(e) => { e.preventDefault(); handleNext(); }}>Next</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit to Database"}
          </Button>
        )}
      </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function PitScoutForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <PitScoutFormContent />
    </Suspense>
  );
}
