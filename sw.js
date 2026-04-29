const CACHE_NAME = 'moviehub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg' // আপনার ছবির নাম অনুযায়ী চেঞ্জ করে নেবেন
];

// Install Service Worker and Cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept fetch requests and serve from cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Try network, if it fails (offline), catch it
        return fetch(event.request).catch(() => {
            // If offline and trying to load a page, return index.html
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        });
      })
  );
});