/* Offline cache for Hobby Café. Bump VERSION when files change. */
const VERSION = 'hobby-cafe-v2';
const FILES = ['./', 'index.html', 'styles.css', 'data.js', 'engine.js', 'app.js', 'icon.svg', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // network-first so updates arrive; cache as offline fallback
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
