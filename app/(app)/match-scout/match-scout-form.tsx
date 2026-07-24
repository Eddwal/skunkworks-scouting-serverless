'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/firebase-client';
import { doc, setDoc, collection, onSnapshot, query, orderBy, runTransaction } from 'firebase/firestore';
import { useEvent } from '@/hooks/use-event';
import { getGameConfig, DEFAULT_YEAR } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';

import { SetupStep } from '@/components/match-scouting/setup-step';
import { ReviewStep } from '@/components/match-scouting/review-step';
import { baseMatchSetupSchema } from '@/components/match-scouting/schemas';

const baseFormSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  matchSetup: baseMatchSetupSchema,
});

function MatchScoutFormContent() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { events, activeEvent } = useEvent();
  const [matches, setMatches] = useState<any[]>([]);
  
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
    
    setIsSubmitting(true);
    try {
      const activeTeamId = data.matchSetup.isSubstitute && data.matchSetup.substituteTeamId 
        ? data.matchSetup.substituteTeamId 
        : data.matchSetup.scheduledTeamId;
        
      const dbTeamId = activeTeamId.startsWith('frc') ? activeTeamId : `frc${activeTeamId}`;
      const docId = `${data.matchSetup.matchKey}_${dbTeamId}`;
      
      const matchDocRef = doc(db, 'events', data.eventId, 'matchScout', docId);
      const teamDocRef = doc(db, 'events', data.eventId, 'teams', dbTeamId);
      
      await runTransaction(db, async (transaction) => {
        // Reads must happen before writes
        const teamDoc = await transaction.get(teamDocRef);
        const currentData = teamDoc.data() || {};
        
        // Write the individual match log
        transaction.set(matchDocRef, {
          ...data,
          teamId: dbTeamId,
          year,
          updatedAt: new Date().toISOString()
        });

        // Update team analytics
        const analytics = currentData.analytics || {
          matchCount: 0,
          uptime: { autoDeadCount: 0, teleopDeadCount: 0 },
          fouls: { major: 0, minor: 0 },
          notes: []
        };

        analytics.matchCount += 1;

        const autoDead = data.auto?.deadInTheWater === true;
        const teleopDead = data.teleop?.deadInTheWater === true;
        if (autoDead) analytics.uptime.autoDeadCount += 1;
        if (teleopDead) analytics.uptime.teleopDeadCount += 1;

        const autoMajor = Number(data.auto?.majorFouls) || 0;
        const autoMinor = Number(data.auto?.minorFouls) || 0;
        const teleopMajor = Number(data.teleop?.majorFouls) || 0;
        const teleopMinor = Number(data.teleop?.minorFouls) || 0;

        analytics.fouls.major += autoMajor + teleopMajor;
        analytics.fouls.minor += autoMinor + teleopMinor;

        const endgameNotes = data.endgame?.notes;
        if (endgameNotes && endgameNotes.trim().length > 0) {
          analytics.notes.push({
            title: data.matchSetup.matchKey,
            content: endgameNotes.trim()
          });
        }

        // Update the team document with the new analytics
        transaction.set(teamDocRef, { analytics }, { merge: true });
      });
      
      toast.success("Match scouting data saved successfully!");
      reset();
      setStep(1);
    } catch (err: any) {
      toast.error(`Error saving data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
              {watchMatchSetup.matchKey} - Team {activeTeamId.replace('frc', '')}
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

export function MatchScoutForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <MatchScoutFormContent />
    </Suspense>
  );
}
