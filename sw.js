const CACHE_NAME = 'ms-dev-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './images/logo-dark-noBG.png',
    './images/MarinSabo.jpg',
    './images/gamechanger-all-white-logo.png',
    './images/ikarus-agency-all-white-logo.png',
    './images/wavelance-all-white-logo.png',
    './images/vukovarski-golubici-all-white-logo.png',
    './images/codehustling-all-white-logo.webp',
    './images/wavelance-logo.png',
    './images/gamechanger.webp'
];

// Install Event - Cache Static Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Network First for HTML, Cache First for Images
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Strategy: Cache First for Images
    if (requestUrl.pathname.startsWith('/images/')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Strategy: Stale-While-Revalidate for everything else (HTML, CSS, JS)
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            });
        })
    );
});
