import {
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  onIdTokenChanged as firebaseOnIdTokenChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import { auth } from './firebase-client';

export function onAuthStateChanged(cb: Parameters<typeof firebaseOnAuthStateChanged>[1]) {
  return firebaseOnAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb: Parameters<typeof firebaseOnIdTokenChanged>[1]) {
  return firebaseOnIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  return firebaseSignOut(auth);
}