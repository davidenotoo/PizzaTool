const CACHE_NAME = 'pizza-calc-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './pizza.png',
    './favicon.png',
    './back.png'
];

// Installazione del Service Worker e salvataggio in cache delle risorse
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Gestione delle richieste (Cache First con fallback sulla rete)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});