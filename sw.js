const CACHE_NAME = 'film-database-v2';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/i18n.js',
  './js/config.js',
  './js/auth.js',
  './js/cameras.js',
  './js/lenses.js',
  './js/films.js',
  './js/dashboard.js',
  './js/stocksMeta.js',
  './js/filmDetail.js',
  './js/timeline.js',
  './js/stats.js',
  './js/app.js',
  './base.jpeg',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
