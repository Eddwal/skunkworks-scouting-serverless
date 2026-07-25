import { MatchScoutForm } from './match-scout-form';
import { SavedQRCodes } from './saved-qr-codes';
import { ScanQR } from './scan-qr';

export const metadata = {
  title: 'Match Scouting',
  description: 'Scout robot performance in a match',
};

export default function MatchScoutPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl mt-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Match Scouting</h1>
        <div className="flex items-center gap-2">
          <ScanQR />
          <SavedQRCodes />
        </div>
      </div>
      <MatchScoutForm />
    </div>
  );
}
