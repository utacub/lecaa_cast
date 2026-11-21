'use strict';
// maintenance/update-sw.py rewrites CACHE and APP_BYTES on every deployment that changes a shell file.
const PREFIX = 'lecaa-cast-';
const CACHE = PREFIX + '0.6.13-a39b82c4';
const ROOT = '/lecaa_cast/';
// index.html holds the whole programme: every image, audio, video and font is embedded in it.
const APP_BYTES = 96354493;
const SHELL = [ROOT, ROOT + 'pwa.js', ROOT + 'manifest.webmanifest', ROOT + 'icons/icon-192.png', ROOT + 'icons/icon-512.png', ROOT + 'icons/maskable-512.png', ROOT + 'icons/apple-touch-icon.png'];

async function tell(message) {
  for (const client of await self.clients.matchAll({type:'window', includeUncontrolled:true})) client.postMessage(message);
}
// Download index.html while counting bytes, so the page can show a progress bar.
async function storeApp(cache) {
  const response = await fetch(new Request(ROOT, {cache:'reload'}));
  if (!response.ok) throw new Error('HTTP ' + response.status);
  // Content-Length is the compressed size when the server compresses; then the known size is the reference.
  const length = Number(response.headers.get('content-length')) || 0;
  const total = !response.headers.get('content-encoding') && length ? length : APP_BYTES;
  const headers = {'Content-Type': response.headers.get('content-type') || 'text/html; charset=utf-8'};
  if (!response.body || typeof TransformStream !== 'function') { await cache.put(ROOT, new Response(await response.blob(), {headers})); return; }
  let done = 0, last = 0;
  const counter = new TransformStream({
    transform(chunk, controller) {
      done += chunk.byteLength; controller.enqueue(chunk);
      const now = Date.now();
      if (now - last > 250) { last = now; tell({type:'LECAA_CAST_PROGRESS', done, total: Math.max(total, done)}); }
    }
  });
  // A broken connection errors the stream, so cache.put rejects and nothing partial is kept.
  await cache.put(ROOT, new Response(response.body.pipeThrough(counter), {headers}));
  if (total === length && done !== length) throw new Error('Incomplete download');
  await tell({type:'LECAA_CAST_PROGRESS', done, total: done});
}
self.addEventListener('install', event => {
  // Atomic precache: installation fails if any resource cannot be stored.
  // No skipWaiting: a new version must not interrupt a learner's session.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      await cache.addAll(SHELL.filter(url => url !== ROOT).map(url => new Request(url, {cache:'reload'})));
      await storeApp(cache);
    } catch (error) { await caches.delete(CACHE); await tell({type:'LECAA_CAST_FAILED'}); throw error; }
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
