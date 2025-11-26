const CACHE_NAME = 'dentis-full-cache-v1';
const urlsToCache = [
  '/',                  // головна сторінка
  '/index.html',
  '/icons/icon-192.png'
  '/icons/icon-512.png'
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/images/ZARA_LOGO_with_Text.png',
  '/assets/images/ZARA_LOGO.png'
  // Додайте інші зображення та сторінки сайту сюди
];

// Встановлення та кешування
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Обробка запитів
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html')) // fallback для offline
  );
});

// Активація та очищення старих кешів
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});
