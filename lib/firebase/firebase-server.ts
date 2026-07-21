import 'server-only';
import { headers } from 'next/headers';
import { initializeServerApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function getAuthenticatedApp() {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization') || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : undefined;

  const firebaseServerApp = initializeServerApp(firebaseConfig, {
    authIdToken: idToken,
  });

  const auth = getAuth(firebaseServerApp);

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true' ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST
  ) {
    const host =
      process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ||
      '127.0.0.1:9099';
    const emulatorUrl = host.startsWith('http') ? host : `http://${host}`;
    if (!(auth as any)._emulatorConfigured) {
      try {
        connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
        (auth as any)._emulatorConfigured = true;
      } catch {
        // Ignore if already connected
      }
    }
  }

  return { 
    firebaseServerApp, 
    currentUser: auth.currentUser 
  };
}