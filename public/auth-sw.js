/// <reference lib="webworker" />

// @ts-ignore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
// @ts-ignore
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
const params = new URL(location.href).searchParams;

const app = initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
});

const auth = getAuth(app);

if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch {
    // Ignore if already connected
  }
}

let appCheckToken = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'APP_CHECK_TOKEN') {
    appCheckToken = event.data.token;
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.origin !== self.location.origin) return;
  
  // Workaround for Chrome's only-if-cached error
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  event.respondWith((async () => {
    try {
      await auth.authStateReady();

      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      
      if (token || appCheckToken) {
        const headers = new Headers(event.request.headers);
        if (token) headers.append('Authorization', `Bearer ${token}`);
        if (appCheckToken) headers.append('X-Firebase-AppCheck', appCheckToken);

        // Extract body for non-GET/HEAD requests to avoid Chrome stream cloning errors
        const hasBody = !['GET', 'HEAD'].includes(event.request.method);
        const body = hasBody ? await event.request.clone().blob() : undefined;

        const requestInit = {
          method: event.request.method,
          headers,
          credentials: event.request.credentials,
          cache: event.request.cache,
          redirect: event.request.redirect,
          referrer: event.request.referrer,
        };
        
        if (hasBody) requestInit.body = body;
        requestInit.mode = event.request.mode === 'navigate' ? 'same-origin' : event.request.mode;

        const newRequest = new Request(event.request.url, requestInit);
        
        return fetch(newRequest);
      }
    } catch (error) {
      console.error('Service Worker auth error:', error);
    }

    return fetch(event.request);
  })());
});