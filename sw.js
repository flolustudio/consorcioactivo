/**
 * sw.js — Consorcio Activo Service Worker
 * Vanilla Web · Estrategia Cache-First para assets, Network-First para HTML
 *
 * CACHE_VERSION: incrementar en cada deploy para forzar actualización en clientes.
 *
 * ── Workflow para agregar/sacar propiedades ─────────────────────────────────
 *  1. Editá data/properties.js (agregar o eliminar el objeto).
 *  2. Copiá/borrá la imagen en public/images/prop-{id}.{ext}.
 *  3. Actualizá PROP_IMAGES abajo: agregá o quitá la línea correspondiente.
 *  4. Incrementá CACHE_VERSION (ej: 'ca-v26' → 'ca-v27').
 *  5. Commit + push → GitHub Pages sirve la nueva versión; el SW viejo
 *     se reemplaza automáticamente en la siguiente visita.
 * ────────────────────────────────────────────────────────────────────────────
 */

const CACHE_VERSION  = 'ca-v27';
const CACHE_STATIC   = `${CACHE_VERSION}-static`;
const CACHE_PAGES    = `${CACHE_VERSION}-pages`;

/**
 * Imágenes de propiedades individuales.
 * Convención: prop-{id}.{ext} — foto principal.
 *             prop-{id}b.{ext}, prop-{id}c.{ext} — fotos adicionales (carrusel).
 *
 * Al agregar la propiedad 13 con 2 fotos:
 *   '/public/images/prop-13.jpg',
 *   '/public/images/prop-13b.jpg',
 * Al sacarla: eliminar todas sus líneas.
 */
const PROP_IMAGES = [
  // prop-1 — 3 fotos (carrusel demo)
  '/public/images/prop-1.png',
  '/public/images/prop-1b.png',
  '/public/images/prop-1c.png',
  // resto — 1 foto cada una
  '/public/images/prop-2.png',
  '/public/images/prop-3.png',
  '/public/images/prop-4.png',
  '/public/images/prop-5.png',
  '/public/images/prop-6.png',
  '/public/images/prop-7.jpg',
  '/public/images/prop-8.jpg',
  '/public/images/prop-9.jpg',
  '/public/images/prop-10.jpg',
  '/public/images/prop-11.jpg',
  '/public/images/prop-12.jpg',
];

/* Assets base que se pre-cachean en la instalación */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/nosotros.html',
  '/propiedades.html',
  '/soporte.html',
  '/contacto.html',
  '/terminos.html',
  '/privacidad.html',
  '/styles.css?v=20260603-03',
  '/app.js?v=20260603-03',
  '/components/AppNav.js?v=20260603-03',
  '/components/PropertyCard.js?v=20260603-03',
  '/components/ContactForm.js?v=20260603-03',
  '/services/PropertyStore.js?v=20260603-03',
  '/services/API.js',
  '/services/Properties.js',
  '/data/properties.js',
  '/manifest.webmanifest',
  '/icons/logoBLACK.png',
  '/icons/favicon.svg',
  ...PROP_IMAGES,
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
