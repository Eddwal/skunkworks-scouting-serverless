'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/firebase-client';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useEvent } from '@/hooks/use-event';
import { useScouts } from '@/hooks/use-scouts';
import { getGameConfig, DEFAULT_YEAR } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { formatMatchName } from '@/lib/utils';

import { SetupStep } from '@/components/match-scouting/setup-step';
import { ReviewStep } from '@/components/match-scouting/review-step';
import { baseMatchSetupSchema } from '@/components/match-scouting/schemas';

const baseFormSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  matchSetup: baseMatchSetupSchema,
});

function MatchScoutFormContent() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { events, activeEvent } = useEvent();
  const { activeScout } = useScouts();
  const [matches, setMatches] = useState<any[]>([]);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentQRData, setCurrentQRData] = useState('');
  
  const year = activeEvent?.id ? activeEvent.id.substring(0, 4) : DEFAULT_YEAR;
  const gameConfig = getGameConfig(year);

  const fullSchema = baseFormSchema.extend({
    auto: gameConfig.matchScout?.autoSchema || z.any(),
    teleop: gameConfig.matchScout?.teleopSchema || z.any(),
    endgame: gameConfig.matchScout?.endgameSchema || z.any(),
  });

  const { control, handleSubmit, watch, trigger, formState: { errors }, reset, setValue, register } = useForm({
    resolver: zodResolver(fullSchema),
    shouldUnregister: false,
    defaultValues: {
      eventId: activeEvent?.id || '',
      matchSetup: {
        matchKey: '',
        scheduledTeamId: '',
        isSubstitute: false,
        substituteTeamId: '',
        noShow: false,
      },
      auto: {},
      teleop: {},
      endgame: {},
    }
  });

  const watchEventId = watch('eventId');
  const watchMatchSetup = watch('matchSetup');
  const watchIsSubstitute = watch('matchSetup.isSubstitute');
  
  const selectedEvent = events.find(e => e.id === watchEventId);
  const teams = selectedEvent?.teams || [];

  const selectedMatch = matches.find(m => m.matchKey === watchMatchSetup?.matchKey);
  const scheduledTeams = selectedMatch ? [...(selectedMatch.redTeams || []), ...(selectedMatch.blueTeams || [])] : [];

  useEffect(() => {
    if (activeEvent) {
      setValue('eventId', activeEvent.id);
    }
  }, [activeEvent, setValue]);

  useEffect(() => {
    if (!activeEvent?.id) {
      setMatches([]);
      return;
    }
    const matchesRef = collection(db, "events", activeEvent.id, "matches");
    const q = query(matchesRef, orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMatches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(fetchedMatches);
    });
    return () => unsubscribe();
  }, [activeEvent?.id]);

  const handleResetForm = () => {
    reset({
      eventId: activeEvent?.id || '',
      matchSetup: {
        matchKey: '',
        scheduledTeamId: '',
        isSubstitute: false,
        substituteTeamId: '',
        noShow: false,
      },
      auto: {},
      teleop: {},
      endgame: {},
    });
    setStep(1);
  };

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['eventId', 'matchSetup'];
    if (step === 2) fieldsToValidate = ['auto'];
    if (step === 3) fieldsToValidate = ['teleop'];
    if (step === 4) fieldsToValidate = ['endgame'];
    
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
    
    if (!activeScout) {
      toast.error("Please select your name as the scout in the top navigation bar before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const activeTeamId = data.matchSetup.isSubstitute && data.matchSetup.substituteTeamId 
        ? data.matchSetup.substituteTeamId 
        : data.matchSetup.scheduledTeamId;
        
      const dbTeamId = activeTeamId;
      
      const uploadData = {
        ...data,
        teamId: dbTeamId,
        year,
        scoutId: activeScout.id,
        scoutName: activeScout.name
      };
      
      const { uploadMatchScoutData } = await import('@/app/actions/upload-action');
      const token = user ? await user.getIdToken() : undefined;
      await uploadMatchScoutData(uploadData, token);
      
      toast.success("Match scouting data saved successfully!");
      handleResetForm();
    } catch (err: any) {
      toast.error(`Error saving data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateQR = (e: React.MouseEvent) => {
    e.preventDefault();
    const data = watch();
    const activeTeamId = data.matchSetup.isSubstitute && data.matchSetup.substituteTeamId 
      ? data.matchSetup.substituteTeamId 
      : data.matchSetup.scheduledTeamId;
      
    if (!activeTeamId) {
      toast.error("Please select a team first");
      return;
    }
    
    if (!activeScout) {
      toast.error("Please select your name as the scout in the top navigation bar before generating a QR code.");
      return;
    }
      
    const dbTeamId = activeTeamId;
    
    const exportData = {
      ...data,
      teamId: dbTeamId,
      year,
      timestamp: new Date().toISOString(),
      scoutId: activeScout.id,
      scoutName: activeScout.name
    };
    
    const qrString = JSON.stringify(exportData);
    setCurrentQRData(qrString);
    setQrDialogOpen(true);
    
    const stored = localStorage.getItem('matchScoutQRCodes');
    const codes = stored ? JSON.parse(stored) : [];
    
    const existingIndex = codes.findIndex((c: any) => c.matchKey === data.matchSetup.matchKey && c.teamId === dbTeamId);
    
    const newCode = {
      id: `${data.matchSetup.matchKey}_${dbTeamId}_${Date.now()}`,
      matchKey: data.matchSetup.matchKey,
      teamId: dbTeamId,
      timestamp: new Date().toISOString(),
      data: qrString
    };
    
    if (existingIndex >= 0) {
      codes[existingIndex] = newCode;
    } else {
      codes.push(newCode);
    }
    
    localStorage.setItem('matchScoutQRCodes', JSON.stringify(codes));
    window.dispatchEvent(new Event('qrCodesUpdated'));
  };

  const AutoComponent = gameConfig.matchScout?.AutoComponent;
  const TeleopComponent = gameConfig.matchScout?.TeleopComponent;
  const EndgameComponent = gameConfig.matchScout?.EndgameComponent;

  if (!AutoComponent || !TeleopComponent || !EndgameComponent) {
    return <div className="p-4 text-center text-destructive">Match Scouting is not configured for the active game year.</div>;
  }

  const activeTeamId = (watchMatchSetup?.isSubstitute && watchMatchSetup?.substituteTeamId 
    ? watchMatchSetup?.substituteTeamId 
    : watchMatchSetup?.scheduledTeamId) as string | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Scouting</CardTitle>
        {step > 1 && !!watchMatchSetup?.matchKey && !!activeTeamId && (
          <CardAction>
            <Badge variant="default" className="text-sm px-4 py-1">
              {selectedMatch ? formatMatchName(selectedMatch.compLevel, selectedMatch.setNumber, selectedMatch.matchNumber) : watchMatchSetup.matchKey} - Team {activeTeamId}
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
              {i === 2 && 'Auto'}
              {i === 3 && 'Teleop'}
              {i === 4 && 'Endgame'}
              {i === 5 && 'Export'}
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
            scheduledTeams={scheduledTeams}
            watchIsSubstitute={!!watchIsSubstitute}
            matches={matches}
          />
        )}

        {step === 2 && (
          <AutoComponent control={control as any} errors={errors} register={register as any} setValue={setValue as any} watch={watch as any} />
        )}

        {step === 3 && (
          <TeleopComponent control={control as any} errors={errors} register={register as any} setValue={setValue as any} watch={watch as any} />
        )}

        {step === 4 && (
          <EndgameComponent control={control as any} errors={errors} register={register as any} setValue={setValue as any} watch={watch as any} />
        )}

        {step === 5 && (
          <ReviewStep 
            formData={{...watch(), teamId: activeTeamId}} 
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
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={handleGenerateQR}>
              Save to QR Code
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit to Database"}
            </Button>
          </div>
        )}
      </div>
        </form>
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generated QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                {currentQRData && <QRCodeSVG value={currentQRData} size={250} />}
              </div>
              <p className="text-sm text-center text-muted-foreground">
                This QR code has been saved to your device. You can access it later from the main scouting page.
              </p>
              <Button 
                className="w-full mt-2" 
                onClick={() => {
                  setQrDialogOpen(false);
                  handleResetForm();
                }}
              >
                Done (Start New Match)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function MatchScoutForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <MatchScoutFormContent />
    </Suspense>
  );
}
