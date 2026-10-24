'use strict';
// Change this cache version for every deployment that changes any shell file.
const PREFIX = 'lecaa-cast-';
const CACHE = PREFIX + '0.6.6-779b0580';
const ROOT = '/lecaa_cast/';
const SHELL = [ROOT, ROOT + 'manifest.webmanifest', ROOT + 'icons/icon-192.png', ROOT + 'icons/icon-512.png', ROOT + 'icons/maskable-512.png', ROOT + 'icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  // Atomic precache: installation fails if any resource cannot be stored.
  // No skipWaiting: a new version must not interrupt a learner's session.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(SHELL.map(url => new Request(url, {cache:'reload'}))); }
    catch (error) { await caches.delete(CACHE); throw error; }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(ROOT)) return;
  const home = event.request.mode === 'navigate' && (url.pathname === ROOT || url.pathname === ROOT + 'index.html');
  const key = home ? ROOT : url.pathname;
  if (!home && !SHELL.includes(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(key)) || fetch(event.request);
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type !== 'LECAA_CAST_STATUS') return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    if ((await Promise.all(SHELL.map(url => cache.match(url)))).every(Boolean)) event.ports[0]?.postMessage({type:'LECAA_CAST_READY', version:CACHE});
  })());
});
