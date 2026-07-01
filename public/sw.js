
const CACHE_NAME = 'woody-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 安裝：預先快取 App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 啟用：清除舊版快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 攔截請求：Network-first with cache fallback（適用於 SPA）
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只處理 GET 請求
  if (request.method !== 'GET') return;
  // 忽略非 HTTP(S) 請求
  if (!request.url.startsWith('http')) return;
  // API 與 Admin 路徑不進入 SW（保留給 Cloudflare Access 與 API 正常運作）
  if (request.url.includes('/api/')) return;
  if (request.url.includes('/admin')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(request).then((res) => res || new Response('', { status: 503 })))
  );
});
