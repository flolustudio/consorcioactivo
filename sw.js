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

const CACHE_VERSION  = 'ca-v38';
const CACHE_STATIC   = `${CACHE_VERSION}-static`;
const CACHE_PAGES    = `${CACHE_VERSION}-pages`;
const CACHE_DATA     = `${CACHE_VERSION}-data`;

/* Rutas de datos: nunca van al precache ni se sirven Cache-First. */
const DATA_PATH_PREFIX = '/data/';

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
  // id4 — 11 fotos (public/properties/id4/)
  '/public/properties/id4/id4-foto1.jpg',
  '/public/properties/id4/id4-foto2.jpg',
  '/public/properties/id4/id4-foto3.jpg',
  '/public/properties/id4/id4-foto4.jpg',
  '/public/properties/id4/id4-foto5.jpg',
  '/public/properties/id4/id4-foto6.jpg',
  '/public/properties/id4/id4-foto7.jpg',
  '/public/properties/id4/id4-foto8.jpg',
  '/public/properties/id4/id4-foto9.jpg',
  '/public/properties/id4/id4-foto10.jpg',
  '/public/properties/id4/id4-foto11.jpg',
  // id5–id12 — 1 foto cada una
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
  '/styles.css?v=20260629-01',
  '/app.js?v=20260629-01',
  '/components/AppNav.js?v=20260629-01',
  '/components/PropertyCard.js?v=20260629-01',
  '/components/ContactForm.js?v=20260629-01',
  '/services/PropertyStore.js?v=20260629-01',
  '/services/API.js?v=20260629-01',
  '/services/Properties.js?v=20260629-01',
  /* data/properties.js se excluye del precache — se sirve siempre
     Network-First para garantizar datos frescos en cada visita */
  '/vista-detalle/id1.html',
  '/public/images/header-contacto-ampliadov1.jpg',
  '/manifest.webmanifest',
  '/public/images/logo horizontal-26-06.png',
  '/icons/favicon.svg',
  /* PROP_IMAGES se excluye del precache — las imágenes de propiedades se
     cachean on-demand vía el fetch handler (Cache-First). Esto evita
     descargar ~149 MB en la instalación del SW. */
];

/* ── Install: pre-cachea assets estáticos ─────────────────── */
/* Usamos cache:'no-cache' en cada fetch para bypassear el CDN de GitHub
   Pages (y el HTTP cache del browser) durante el precache. Así el SW
   siempre instala la versión más fresca que el origen tiene disponible. */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache =>
      Promise.all(
        PRECACHE_ASSETS.map(url =>
          fetch(new Request(url, { cache: 'no-cache' }))
            .then(resp => resp.ok ? cache.put(url, resp) : null)
            .catch(() => null)   // asset no crítico: no bloquear install
        )
      )
    ).then(() => self.skipWaiting())
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
      .then(() => purgeDataFromCaches())
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
  const isData    = url.pathname.startsWith(DATA_PATH_PREFIX);

  if (isData) {
    // Datos: red fresca, bypass del HTTP cache, fallback offline separado.
    event.respondWith(networkFirst(request, CACHE_DATA, {
      cacheMode: 'reload',
      fallbackToIndex: false,
    }));
  } else if (isHTML) {
    // Network-First para HTML — siempre contenido fresco de la red.
    // El fallback offline usa caché si existe.
    event.respondWith(networkFirst(request, CACHE_PAGES, {
      cacheMode: 'reload',
      fallbackToIndex: true,
    }));
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
async function networkFirst(request, cacheName, options = {}) {
  try {
    const fetchRequest = requestWithCacheMode(request, options.cacheMode);
    const response = await fetch(fetchRequest);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline → sirve desde caché si existe
    const cached = await caches.match(request);
    if (cached) return cached;

    if (options.fallbackToIndex) {
      // Fallback a index.html para páginas no cacheadas
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }

    return new Response('', { status: 503 });
  }
}

function requestWithCacheMode(request, cacheMode) {
  if (!cacheMode) return request;

  try {
    return new Request(request, { cache: cacheMode });
  } catch {
    return request;
  }
}

/* Elimina copias viejas de /data/ aunque hayan quedado en caches anteriores. */
async function purgeDataFromCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.map(async key => {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    const dataRequests = requests.filter(request => {
      const url = new URL(request.url);
      return url.origin === self.location.origin && url.pathname.startsWith(DATA_PATH_PREFIX);
    });

    await Promise.all(dataRequests.map(request => cache.delete(request)));
  }));
}
