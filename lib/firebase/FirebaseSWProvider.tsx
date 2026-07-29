'use client'
import { useEffect } from 'react';

import { appCheck } from './firebase-client';
import { onTokenChanged } from 'firebase/app-check';

export function FirebaseSWProvider({ children }: {children: React.ReactNode}) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swUrl = new URL('/auth-sw.js', window.location.origin);
      swUrl.searchParams.set('apiKey', process.env.NEXT_PUBLIC_FIREBASE_API_KEY!);
      swUrl.searchParams.set('authDomain', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!);
      swUrl.searchParams.set('projectId', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!);

      navigator.serviceWorker.register(swUrl.toString(), { type: 'module' });

      // Listen for App Check token changes and send to Service Worker
      if (appCheck) {
        onTokenChanged(appCheck, {
          next: (token) => {
            navigator.serviceWorker.ready.then(registration => {
              if (registration.active) {
                registration.active.postMessage({ type: 'APP_CHECK_TOKEN', token: token.token });
              }
            });
          },
          error: (err) => console.error('App Check token error:', err)
        });
      }
    }
  }, []);
  
  return <>{children}</>;
}