const CACHE_NAME = 'finance-tracker-v1';
const assets = [
  './',
  './test.html',
  './manifest.json',
  './favicon.svg',
  './web-app-manifest-192x192.png',
  './web-app-manifest-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});