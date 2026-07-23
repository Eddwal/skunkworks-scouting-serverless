'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { RowsIcon } from '@phosphor-icons/react';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        router.replace('/login');
      } else if (user && isPublicRoute) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, isPublicRoute, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg animate-pulse">
            <RowsIcon className="size-6" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Verifying authentication...
          </div>
        </div>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg animate-pulse">
            <RowsIcon className="size-6" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  if (user && isPublicRoute) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg animate-pulse">
            <RowsIcon className="size-6" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
