
const CACHE_NAME = 'woody-v3';

// 安裝時直接啟用，不清除任何東西
self.addEventListener('install', () => self.skipWaiting());

// 啟用時接管所有頁面，並清除全部舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// 攔截請求：僅快取 HTML，JS/chunk 一律走網路（避免 hash 變更問題）
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  if (event.request.url.includes('/api/')) return;
  if (event.request.url.includes('/admin')) return;

  const url = new URL(event.request.url);

  // 靜態資源（JS/CSS/圖片）— 永遠走網路，不經 SW 快取
  if (url.pathname.startsWith('/assets/') || /\.(js|css|png|jpg|webp|svg|woff2?)$/i.test(url.pathname)) {
    return; // 不攔截，讓瀏覽器正常請求
  }

  // 頁面（HTML）— Network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
