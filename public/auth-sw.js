/// <reference lib="webworker" />

// @ts-ignore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
// @ts-ignore
import { getAuth, onAuthStateChanged, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

const app = initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
});

// Initialize auth with the modular syntax
const auth = getAuth(app);

if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch {
    // Ignore if already connected
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });

      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      if (token) {
        const headers = new Headers(event.request.headers);
        headers.append('Authorization', `Bearer ${token}`);

        const newRequest = new Request(event.request.url, {
          method: event.request.method,
          headers,
          credentials: event.request.credentials,
          cache: event.request.cache,
          redirect: event.request.redirect,
          referrer: event.request.referrer,
        });
        
        return fetch(newRequest);
      }
    } catch (error) {
      console.error('Service Worker auth error:', error);
    }

    return fetch(event.request);
  })());
});