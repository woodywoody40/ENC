const CACHE_NAME = 'woody-v5';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 清理舊版 SW 快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('woody-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // 跳過 API 與管理後台
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // 1. 靜態資源 (帶 hash 的 /assets/、字體、圖片)：Cache-First 策略
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(woff2?|ttf|eot|png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // 2. HTML 導航頁面：Network-First (離線時 Fallback 到已快取 HTML 或首頁)
  if (
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          if (cachedPage) return cachedPage;
          return caches.match('/');
        }),
    );
  }
});
