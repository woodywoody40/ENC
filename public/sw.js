const CACHE_NAME = 'woody-v4';

self.addEventListener('install', () => self.skipWaiting());

// Drop only our previous SW caches (not every origin cache)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('woody-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

// Network-first for navigations; leave hashed /assets/ to the browser
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/admin')) return;
  if (url.pathname.startsWith('/assets/')) return;
  if (/\.(js|css|png|jpg|jpeg|webp|svg|woff2?|map)$/i.test(url.pathname)) return;

  // HTML / navigations — network-first with offline fallback
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
  }
});
