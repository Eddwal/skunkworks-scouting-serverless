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
