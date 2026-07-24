import { MatchScoutForm } from './match-scout-form';

export const metadata = {
  title: 'Match Scouting',
  description: 'Scout robot performance in a match',
};

export default function MatchScoutPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl mt-8">
      <MatchScoutForm />
    </div>
  );
}
