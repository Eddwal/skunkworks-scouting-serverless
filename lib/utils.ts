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
  }
  return formatMatchName(level, setOrMatch, matchNum);
}
