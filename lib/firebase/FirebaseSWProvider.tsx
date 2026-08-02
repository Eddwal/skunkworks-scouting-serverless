'use client'
import { useEffect } from 'react';

import { appCheck } from './firebase-client';
import { onTokenChanged } from 'firebase/app-check';

export function FirebaseSWProvider({ children }: {children: React.ReactNode}) {
  useEffect(() => {
    // Listen for App Check token changes and store in a cookie for Server Actions
    if (appCheck) {
      onTokenChanged(appCheck, {
        next: (token) => {
          document.cookie = `firebaseAppCheckToken=${token.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        },
        error: (err) => console.error('App Check token error:', err)
      });
    }
  }, []);
  
  return <>{children}</>;
}