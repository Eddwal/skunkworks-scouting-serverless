import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMatchName = (level: string, set: number, match: number) => {
  switch(level) {
    case 'qm': return `Quals ${match}`
    case 'sf': return `Semis ${set}`
    case 'f': return `Finals ${match}`
    default: return `${level.toUpperCase()} ${match}`
  }
}

export const formatMatchKey = (matchKey: string) => {
  const match = matchKey.match(/^(?:.*_)?(qm|qf|sf|f)(\d+)?(?:m(\d+))?$/i);
  if (!match) return matchKey;
  
  const level = match[1].toLowerCase();
  const setOrMatch = match[2] ? parseInt(match[2], 10) : 1;
  const matchNum = match[3] ? parseInt(match[3], 10) : 1;

  if (level === 'qm' || level === 'f') {
    return formatMatchName(level, 1, setOrMatch);
  } else {
    return formatMatchName(level, setOrMatch, matchNum);
  }
}

export const getResolvableImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (typeof window === 'undefined') return url;
  
  // LAN support in dev for images
  if (url.includes('localhost:9199') || url.includes('127.0.0.1:9199')) {
    return url.replace(/localhost:9199|127\.0\.0\.1:9199/g, `${window.location.hostname}:9199`);
  }
  return url;
};

/**
 * Calculates the dense rank of a given value against an array of all values.
 * Values are sorted in descending order (highest value = rank 1).
 * 
 * @param value The value to find the rank for
 * @param allValues An array containing all values to compute the rank against
 * @returns A tuple of [rank, totalUniqueRanks].
 */
export const calculateDenseRank = (value: number, allValues: number[]): { rank: number; totalRanks: number } => {
  if (value === undefined || value === null) return { rank: 0, totalRanks: 0 };
  
  const uniqueValues = Array.from(new Set(allValues.filter(v => v !== undefined && v !== null))).sort((a, b) => b - a);
  const totalRanks = uniqueValues.length;
  
  let rank = 0;
  if (uniqueValues.includes(value)) {
    rank = uniqueValues.indexOf(value) + 1;
  }
  return { rank, totalRanks };
}
