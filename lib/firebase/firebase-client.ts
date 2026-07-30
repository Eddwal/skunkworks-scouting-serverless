import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  recaptchaSiteKey: process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY,
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const auth: Auth = getAuth(firebaseApp);
let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(firebaseApp, {
    localCache: typeof window !== 'undefined' 
      ? persistentLocalCache({ tabManager: persistentMultipleTabManager() }) 
      : memoryLocalCache()
  });
} catch (e) {
  firestoreDb = getFirestore(firebaseApp);
}
export const db: Firestore = firestoreDb;
export const storage: FirebaseStorage = getStorage(firebaseApp);
let appCheckInstance;
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY) {
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
  }
  appCheckInstance = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}
export const appCheck = appCheckInstance;

if (
  typeof window !== 'undefined' &&
  (process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local')) // Added check for local hostnames
) {
  // Dynamically use whatever hostname the browser is currently at
  const hostname = window.location.hostname;
  
  const authHost = `${hostname}:9099`;
  const emulatorUrl = `http://${authHost}`;
  
  if (!(auth as any)._emulatorConfigured) {
    try {
      connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
      (auth as any)._emulatorConfigured = true;
    } catch {}
  }

  const firestorePort = 8080;
  if (!(db as any)._emulatorConfigured) {
    try {
      connectFirestoreEmulator(db, hostname, firestorePort);
      (db as any)._emulatorConfigured = true;
    } catch {}
  }

  const storagePort = 9199;
  if (!(storage as any)._emulatorConfigured) {
    try {
      connectStorageEmulator(storage, hostname, storagePort);
      (storage as any)._emulatorConfigured = true;
    } catch {}
  }
}
export { firebaseConfig };
