const CACHE_NAME = 'iks-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ChatGPT%20Image%20Jun%2023,%202026,%2010_45_34%20AM.png',
  './ChatGPT%20Image%20Jun%2023,%202026,%2010_45_44%20AM.png',
  './ChatGPT%20Image%20Jun%2023,%202026,%2010_45_51%20AM.png',
  './manifest.json',
  './icons/icon-192.webp',
  './icons/icon-512.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
