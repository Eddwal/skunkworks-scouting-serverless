'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  onAuthStateChanged,
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
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          setClaims(idTokenResult.claims);
          // Set cookie as fallback for Service Worker race conditions
          document.cookie = `firebaseAuthToken=${idTokenResult.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        } catch (error) {
          console.error("Error fetching claims", error);
          setClaims({});
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
