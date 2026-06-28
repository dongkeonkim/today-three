// 최소 서비스워커: 앱 셸을 캐시해 오프라인에서도 열리게 한다 (stale-while-revalidate).
const CACHE = 'today-three-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  // 같은 출처(앱 셸)만 캐시한다. 외부 API 등 cross-origin 요청은 건드리지 않는다.
  if (new URL(req.url).origin !== self.location.origin) return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
