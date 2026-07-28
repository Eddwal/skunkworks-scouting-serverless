import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatMatchName } from '@/lib/utils';

export interface MatchOption {
  id: string;
  matchKey: string;
  compLevel: string;
  matchNumber: number;
  setNumber: number;
}

interface MatchSelectProps {
  matches: MatchOption[];
  value: string;
  onValueChange: (value: any) => void;
  disabled?: boolean;
  valueKey?: 'id' | 'matchKey';
  placeholder?: string;
  className?: string;
}

export function MatchSelect({
  matches,
  value,
  onValueChange,
  disabled = false,
  valueKey = 'matchKey',
  placeholder = 'Select a match',
  className
}: MatchSelectProps) {
  const selectedMatch = value ? matches.find(m => m[valueKey] === value) : null;

  return (
    <Select onValueChange={onValueChange} value={value || ""} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedMatch ? formatMatchName(selectedMatch.compLevel, selectedMatch.setNumber, selectedMatch.matchNumber) : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {matches.map(match => (
          <SelectItem key={match.id} value={match[valueKey]}>
            {formatMatchName(match.compLevel, match.setNumber, match.matchNumber)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
