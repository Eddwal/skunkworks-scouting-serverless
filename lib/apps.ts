import { 
  RowsIcon, 
  ClipboardTextIcon,
  WrenchIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  UserGearIcon
} from '@phosphor-icons/react';
import React from 'react';

export interface AppRegistryItem {
  name: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

export const APPS: AppRegistryItem[] = [
  { 
    name: 'Dashboard',
    title: 'Dashboard',
    description: 'Central hub for scouting',
    href: '/dashboard', 
    icon: RowsIcon 
  },
  {
    name: 'Standings',
    title: 'Standings',
    description: 'Leaderboard of all teams',
    href: '/standings',
    icon: ChartBarIcon
  },

  { 
    name: 'Match Scout',
    title: 'Match Scout',
    description: 'Record data during a match',
    href: '/match-scout', 
    icon: ClipboardTextIcon 
  },
  { 
    name: 'Pit Scout',
    title: 'Pit Scout',
    description: 'Collect team info in the pits',
    href: '/pit-scout', 
    icon: WrenchIcon 
  },
  { 
    name: 'Schedule',
    title: 'Schedule',
    description: 'View upcoming matches',
    href: '/schedule', 
    icon: CalendarIcon 
  },
  { 
    name: 'Team Viewer',
    title: 'Team Viewer',
    description: 'Analyze team performance',
    href: '/team-viewer', 
    icon: UsersIcon 
  },
  { 
    name: 'Pre-Match',
    title: 'Pre-Match Dashboard',
    description: 'Strategy and match prep',
    href: '/pre-match-dashboard', 
    icon: ChartBarIcon 
  },
  {
    name: 'Manage Users',
    title: 'Manage Users',
    description: 'Admin user management',
    href: '/manage-users',
    icon: UserGearIcon,
    adminOnly: true
  }
];
