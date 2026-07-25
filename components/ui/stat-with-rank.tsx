import React from 'react';

export interface StatWithRankProps {
  label: string;
  value: number | undefined;
  allValues?: number[];
  fractionDigits?: number;
}

export function StatWithRank({ label, value, allValues = [], fractionDigits = 1 }: StatWithRankProps) {
  const displayValue = value !== undefined ? value.toFixed(fractionDigits) : 'N/A';
  
  let rankDisplay = null;
  if (value !== undefined && allValues.length > 0) {
    // Unique sorted values (descending)
    const uniqueValues = Array.from(new Set(allValues)).sort((a, b) => b - a);
    const rank = uniqueValues.indexOf(value) + 1;
    const totalRanks = uniqueValues.length;
    
    if (rank > 0) {
      rankDisplay = <div className="text-[10px] text-muted-foreground/80 font-medium">Rank {rank} of {totalRanks}</div>;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg text-center h-full">
      <div className="text-2xl font-bold">{displayValue}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      {rankDisplay}
    </div>
  );
}
