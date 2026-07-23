import { PitScoutForm } from './pit-scout-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PitScoutPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pit Scouting</CardTitle>
          <CardDescription>Fill out the pit scouting form for a team.</CardDescription>
        </CardHeader>
        <CardContent>
          <PitScoutForm />
        </CardContent>
      </Card>
    </div>
  );
}
