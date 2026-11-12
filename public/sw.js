/* =========================================================================
 * R6 Tactical Playbook – Service Worker
 * -------------------------------------------------------------------------
 * Ziel: Nach dem ersten Besuch startet das Playbook auch ohne Netz (Halle,
 * Turnier-WLAN down) und lässt sich auf dem Handy installieren.
 *
 * Strategie:
 *   - Navigation (HTML): network-first, Fallback auf Cache -> offline trotzdem nutzbar
 *   - Build-Assets (hashed): cache-first, da sich Dateinamen bei Änderung ändern
 *   - Bilder/JSON der App: stale-while-revalidate
 *   - Alles andere: nur Netz
 *
 * Wichtig: Bei einem neuen Deploy ändert sich CACHE. Der alte Cache wird beim
 * `activate` gelöscht, damit keine alten Taktiken hängen bleiben.
 * ========================================================================= */

const VERSION = 'v1.4.0';
const CACHE = `r6pb-${VERSION}`;
const OFFLINE_URL = './index.html';

/** Beim Install: Grundgerüst + Icons vorhalten. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll([OFFLINE_URL, './manifest.webmanifest', './icons/icon-192.png', './icons/icon.svg'])
        .catch(() => { /* einzelne Dateien dürfen fehlen */ });
      await self.skipWaiting();
    })(),
  );
});

/** Beim Aktivieren: alte Caches entfernen und sofort übernehmen. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

const isAsset = (url) => /\/assets\/.+\.(js|css|woff2?)$/.test(url.pathname);
/** Schriften liegen unter /fonts/ – cache-first wie Build-Assets (ändern sich nie). */
const isFont = (url) => /\/fonts\/.+\.woff2?$/.test(url.pathname);
const isMedia = (url) => /\.(webp|png|jpe?g|svg|json)$/.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // keine Fremd-Origins cachen

  // 1) HTML-Navigation: Netz zuerst, sonst Cache (Offline-Start)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })(),
    );
    return;
  }

  // 2) gehashte Build-Assets und lokale Schriften: cache-first (unveränderlich)
  if (isAsset(url) || isFont(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      })(),
    );
    return;
  }

  // 3) Bilder & JSON: sofort aus dem Cache, im Hintergrund aktualisieren
  if (isMedia(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => undefined);
        return cached || (await network) || Response.error();
      })(),
    );
  }
});

/** App-Seite kann ein Update anfordern (Einstellungen → „App aktualisieren“). */
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
