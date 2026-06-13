/**
 * sw.js — Consorcio Activo Service Worker
 * Vanilla Web · Cache-First para assets, Network-First para HTML y /data/
 *
 * CACHE_VERSION: incrementar en cada deploy para forzar actualización en clientes.
 *
 * ── Workflow para agregar/sacar propiedades ─────────────────────────────────
 *  1. Editá data/properties.js (agregar o eliminar el objeto).
 *  2. Guardá las imágenes en public/properties/id{n}/ (o public/images/ para legado).
 *  3. Actualizá PROP_IMAGES abajo: agregá o quitá la línea correspondiente.
 *  4. Incrementá CACHE_VERSION (ej: 'ca-v27' → 'ca-v28').
 *  5. Commit + push → GitHub Pages sirve la nueva versión; el SW viejo
 *     se reemplaza automáticamente en la siguiente visita.
 * ────────────────────────────────────────────────────────────────────────────
 */

const CACHE_VERSION  = 'ca-v33';
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
  // id1 — 8 fotos (public/properties/id1/)
  '/public/properties/id1/portada propiedad 2.png',
  '/public/properties/id1/balcon propiedad 2.jpg',
  '/public/properties/id1/baño propiedad 2 (1).jpg',
  '/public/properties/id1/baño propiedad 2.jpg',
  '/public/properties/id1/cocina propiedad 2.jpg',
  '/public/properties/id1/habitacion principal propiedad 2 (1).jpg',
  '/public/properties/id1/habitacion principal propiedad 2.jpg',
  '/public/properties/id1/ingreso propiedad 2.jpg',
  // id2 — 10 fotos (public/properties/id2/)
  '/public/properties/id2/Portada - propiedad 1.png',
  '/public/properties/id2/baño propiedad 1 (1).jpg',
  '/public/properties/id2/baño propiedad 1.jpg',
  '/public/properties/id2/cocina propiedad 1.jpg',
  '/public/properties/id2/habitacion dos propiedad 1 (1).jpg',
  '/public/properties/id2/habitacion dos propiedad 1.jpg',
  '/public/properties/id2/habitacion principal propiedad 1 (1).jpg',
  '/public/properties/id2/habitacion principal propiedad 1.jpg',
  '/public/properties/id2/ingreso propiedad 1.jpg',
  '/public/properties/id2/living comedor propiedad 1.jpg',
  // id3 — 10 fotos (public/properties/id3/)
  '/public/properties/id3/portada propiedad 3.png',
  '/public/properties/id3/balcon propiedad 3.jpg',
  '/public/properties/id3/baño propiedad 3.jpg',
  '/public/properties/id3/cocina propiedad 3.jpg',
  '/public/properties/id3/detalle comedor propiedad 3.jpg',
  '/public/properties/id3/habitacion 2 propiedad 3.jpg',
  '/public/properties/id3/habitacion principal propiedad 3 (1).jpg',
  '/public/properties/id3/habitacion principal propiedad 3 (2).jpg',
  '/public/properties/id3/habitacion principal propiedad 3.jpg',
  '/public/properties/id3/living comedor propiedad 3.jpg',
  // id4–id12 — 1 foto cada una
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
  '/styles.css?v=20260613-04',
  '/app.js?v=20260613-04',
  '/components/AppNav.js?v=20260613-04',
  '/components/PropertyCard.js?v=20260613-04',
  '/components/ContactForm.js?v=20260613-04',
  '/services/PropertyStore.js?v=20260613-04',
  '/services/API.js',
  '/services/Properties.js',
  /* data/properties.js se excluye del precache — se sirve siempre
     Network-First para garantizar datos frescos en cada visita */
  '/public/images/header-contacto-ampliadov1.jpg',
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

/* ── Activate: limpia cachés obsoletos y notifica a clientes ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        /**
         * Avisa a todas las pestañas abiertas que hay un SW nuevo.
         * app.js escucha este mensaje y recarga la página.
         * Funciona incluso con versiones viejas de app.js que no tienen
         * el listener de 'controllerchange'.
         */
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client =>
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION })
        );
      })
  );
});

/* ── Fetch: estrategia según tipo de recurso ─────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo procesa peticiones del mismo origen
  if (url.origin !== self.location.origin) return;

  const isHTML    = request.headers.get('Accept')?.includes('text/html');
  const isData    = url.pathname.startsWith('/data/');

  if (isHTML || isData) {
    // Network-First para HTML y /data/ — siempre contenido fresco de la red.
    // El fallback offline usa caché si existe.
    event.respondWith(networkFirst(request, isData ? CACHE_STATIC : CACHE_PAGES));
  } else {
    // Cache-First para assets estáticos (CSS, JS versionados, imágenes, fuentes)
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
