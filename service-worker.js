// Service Worker for DELTA Lighting Lab
const CACHE_NAME = 'delta-lighting-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/about.html',
  '/tests/thermal.html',
  '/tests/ip.html',
  '/tests/photometric.html',
  '/tests/electrical.html',
  '/tests/color.html'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Silently ignore cache errors
        return Promise.resolve();
      });
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }).catch(() => {
      // Network request failed, return offline page or cached version
      return caches.match(event.request);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-test-requests') {
    event.waitUntil(
      fetch('/api/submit-requests')
        .catch(() => console.log('Background sync failed'))
    );
  }
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'تحديث جديد من DELTA Lighting',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%230066ff" width="192" height="192"/><text x="50%" y="50%" font-size="100" fill="white" dominant-baseline="middle" text-anchor="middle" font-weight="bold">⚡</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle fill="%230066ff" cx="48" cy="48" r="48"/><text x="50%" y="50%" font-size="60" fill="white" dominant-baseline="middle" text-anchor="middle">⚡</text></svg>',
    actions: [
      {
        action: 'open',
        title: 'فتح'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DELTA Lighting', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
