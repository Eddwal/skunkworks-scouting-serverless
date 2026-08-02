'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  signInWithGoogle as firebaseSignInWithGoogle,
} from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  claims: Record<string, any>;
  signInWithGoogle: typeof firebaseSignInWithGoogle;
  signOut: typeof firebaseSignOut;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  claims: {},
  signInWithGoogle: firebaseSignInWithGoogle,
  signOut: firebaseSignOut,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<Record<string, any>>({});

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          setClaims(idTokenResult.claims);
          // Set cookie as fallback for Service Worker race conditions or when offline
          document.cookie = `firebaseAuthToken=${idTokenResult.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        } catch (error) {
          console.warn("Could not fetch claims (likely offline). Keeping existing state.", error);
          // Don't clear claims/cookie here so the user stays logged in while offline.
        }
      } else {
        document.cookie = `firebaseAuthToken=; path=/; max-age=0`;
        setClaims({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        claims,
        signInWithGoogle: firebaseSignInWithGoogle,
        signOut: firebaseSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
