import {
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  onIdTokenChanged as firebaseOnIdTokenChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  getAdditionalUserInfo,
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
  const credential = await signInWithPopup(auth, provider);
  const additionalInfo = getAdditionalUserInfo(credential);
  if (additionalInfo?.isNewUser) {
    await credential.user.delete();
    throw new Error('Only administrators can create new accounts. Please contact an admin.');
  }
  return credential;
}

export async function signOut() {
  return firebaseSignOut(auth);
}