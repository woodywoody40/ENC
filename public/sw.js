const CACHE_NAME = 'woody-v6';

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

  // 跳過 API、管理後台、R2 媒體串流（Range 206 不能進 Cache API）
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/media/')) return;

  // 跳過 Range 分段請求（影片快進會回 206，Cache.put 不支援會拋錯）
  if (event.request.headers.has('range')) return;

  // 跳過帶 hash 的 JS/CSS（讓瀏覽器 HTTP 快取處理，避免新部署後
  // 舊 HTML preload 舊 hash 造成 cross-world mismatch）
  if (
    url.pathname.startsWith('/assets/') ||
    /\.([cm]?js|css)(\.map)?$/i.test(url.pathname)
  ) return;

  // 1. 圖片/字體：Cache-First（只存 200，206/非 OK 不存，且吞掉 put 錯誤）
  if (
    /\.(woff2?|ttf|eot|png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
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
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
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
