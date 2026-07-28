import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamSelectProps {
  teams: string[];
  value: string;
  onValueChange: (value: any) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TeamSelect({
  teams,
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Select a team',
  className
}: TeamSelectProps) {
  // Sort teams numerically
  const sortedTeams = [...teams].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return (
    <Select onValueChange={onValueChange} value={value || ""} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sortedTeams.length > 0 ? (
          sortedTeams.map(team => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">No teams available</div>
        )}
      </SelectContent>
    </Select>
  );
}
