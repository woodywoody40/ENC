
const CACHE_NAME = 'woody-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
];

// 安裝並快取基礎資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 攔截請求：Stale-while-revalidate 策略
self.addEventListener('fetch', (event) => {
  // 只處理 GET 請求，且不處理 API 請求
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;
  // 忽略非 HTTP(S) 的請求 (例如 chrome-extension://)
  if (!event.request.url.startsWith('http')) return;
  // 讓 /admin 的請求直接走網路，讓 Cloudflare Access 可以攔截
  if (event.request.url.includes('/admin')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 同步 clone，避免 response body 被消耗掉
        const responseToCache = networkResponse.clone();
        
        // 更新快取
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // 如果網路失敗且無快取，可以回傳預設頁面
      });

      return cachedResponse || fetchPromise;
    })
  );
});
