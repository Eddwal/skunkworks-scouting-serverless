'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEvent } from '@/hooks/use-event';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CaretDownIcon, SignOutIcon } from '@phosphor-icons/react';
import { APPS } from '@/lib/apps';

export function GlobalNav() {
  const { user, claims, signOut } = useAuth();
  const { events, activeEvent, setActiveEvent } = useEvent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to build app links preserving current search params
  const buildAppHref = (basePath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${basePath}?${params.toString()}`;
  };

  const currentApp = APPS.find(app => pathname.startsWith(app.href)) || APPS[0];

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Logo and App Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "flex items-center gap-2 pl-2 pr-3 hover:bg-muted/50" })}>
            <div className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <currentApp.icon className="size-4" weight="bold" />
            </div>
            <span className="font-semibold text-sm tracking-tight">{currentApp.name}</span>
            <CaretDownIcon className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Scouting Apps</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {APPS.filter(app => !app.adminOnly || (user && claims?.admin)).map((app) => (
              <DropdownMenuItem 
                key={app.href} 
                render={<Link href={buildAppHref(app.href)} />}
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <app.icon className="size-4 text-muted-foreground" />
                <span>{app.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border hidden md:block" />

      </div>

      <div className="flex items-center gap-2">
        {/* Event Selector */}
        <Select 
          value={activeEvent?.id || ''} 
          onValueChange={(value) => { if (value) setActiveEvent(value); }}
        >
          <SelectTrigger className="h-8 w-[140px] md:w-[200px] border-none bg-muted/50 hover:bg-muted focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select Event">
              {activeEvent?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(() => {
              if (events.length === 0) {
                return <div className="p-2 text-sm text-muted-foreground text-center">No events found</div>;
              }

              // Group events by year
              const grouped: Record<string, typeof events> = {};
              events.forEach(event => {
                const year = event.id.substring(0, 4);
                if (!grouped[year]) grouped[year] = [];
                grouped[year].push(event);
              });

              // Sort years descending
              const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

              return years.map((year, index) => (
                <React.Fragment key={year}>
                  {index > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectLabel>{year} Season</SelectLabel>
                    {grouped[year].map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ));
            })()}
          </SelectContent>
        </Select>
        
        {/* User Profile */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative size-8 rounded-full p-0" })}>
              <Avatar className="size-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.email || 'User avatar'} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                <SignOutIcon className="mr-2 size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
