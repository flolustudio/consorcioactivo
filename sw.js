/**
 * sw.js — Consorcio Activo Service Worker
 * Vanilla Web · Estrategia Cache-First para assets, Network-First para HTML
 *
 * Versión: cambiá CACHE_VERSION para invalidar el caché en deploys.
 */

const CACHE_VERSION  = 'ca-v23';
const CACHE_STATIC   = `${CACHE_VERSION}-static`;
const CACHE_PAGES    = `${CACHE_VERSION}-pages`;

/* Assets que se pre-cachean en la instalación */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/nosotros.html',
  '/propiedades.html',
  '/soporte.html',
  '/terminos.html',
  '/privacidad.html',
  '/styles.css?v=20260603-02',
  '/app.js?v=20260603-02',
  '/components/AppNav.js?v=20260603-02',
  '/components/PropertyCard.js?v=20260603-02',
  '/components/ContactForm.js?v=20260603-02',
  '/manifest.webmanifest',
  '/icons/logoBLACK.png',
  '/icons/favicon.svg',
];

/* ── Install: pre-cachea assets estáticos ─────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: limpia cachés obsoletos ───────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: estrategia según tipo de recurso ─────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo procesa peticiones del mismo origen
  if (url.origin !== self.location.origin) return;

  const isHTML = request.headers.get('Accept')?.includes('text/html');

  if (isHTML) {
    // Network-First para páginas HTML (contenido siempre fresco)
    event.respondWith(networkFirst(request, CACHE_PAGES));
  } else {
    // Cache-First para assets (CSS, JS, imágenes, fuentes)
    event.respondWith(cacheFirst(request, CACHE_STATIC));
  }
});

/* ── Estrategia: Cache-First ──────────────────────────────── */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline y sin caché → respuesta vacía con status 503
    return new Response('', { status: 503, statusText: 'Sin conexión' });
  }
}

/* ── Estrategia: Network-First ────────────────────────────── */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline → sirve desde caché si existe
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback a index.html para páginas no cacheadas
    const fallback = await caches.match('/index.html');
    return fallback || new Response('', { status: 503 });
  }
}
