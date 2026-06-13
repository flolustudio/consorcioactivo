/**
 * app.js — Consorcio Activo
 * Islands de comportamiento por página.
 * Vanilla Web (Firtman) — cero frameworks, cero dependencias
 *
 * El toggle del nav ya vive en components/AppNav.js.
 * Este archivo registra el Service Worker y coordina
 * cualquier comportamiento page-level adicional.
 */

/* ── Service Worker (PWA) ─────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => { /* silencioso en desarrollo */ });
  });

  /**
   * Recarga automática cuando un nuevo SW toma el control.
   * Patrón estándar para evitar que el usuario vea datos cacheados
   * por el SW anterior. Solo recarga una vez (guarda con flag).
   *
   * Flujo: nuevo SW instala → skipWaiting() → activa → clients.claim()
   * → dispara 'controllerchange' aquí → reload → página fresca del nuevo cache.
   */
  let _swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!_swRefreshing) {
      _swRefreshing = true;
      window.location.reload();
    }
  });
}

/* ── Botón flotante WhatsApp — visible en todas las páginas ── */
(function() {
  const WPP_NUM = '5492995880858';
  const btn = document.createElement('a');
  btn.href = `https://wa.me/${WPP_NUM}`;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'wpp-float';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp');
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
             -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075
             -.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059
             -.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
             .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52
             -.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
             -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
             -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074
             .149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625
             .712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413
             .248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.097 1.508 5.824L.057 23.428
             a.5.5 0 0 0 .609.61l5.748-1.503A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373
             12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.028-1.384l-.36-.214
             -3.733.976.997-3.633-.235-.374A9.818 9.818 0 0 1 2.182 12
             C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12
             S17.427 21.818 12 21.818z"/>
  </svg>`;
  document.body.appendChild(btn);
}());

/* ── Comportamiento mobile nav (fallback si app-nav no carga) ── */
(() => {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelectorAll('.nav-links a');

  if (!nav || !toggle) return;
  if (customElements.get('app-nav') || nav.closest('app-nav')) return;

  /* ── helpers ─────────────────────────────────────────── */
  const open  = () => { nav.classList.add('is-open');    toggle.setAttribute('aria-expanded', 'true');  };
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  const isOpen = () => nav.classList.contains('is-open');

  /* ── toggle on hamburger click ───────────────────────── */
  toggle.addEventListener('click', () => isOpen() ? close() : open());

  /* ── close when a nav link is clicked (mobile UX) ───── */
  links.forEach(a => a.addEventListener('click', close));

  /* ── close on Escape key ─────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) {
      close();
      toggle.focus();
    }
  });

  /* ── close on outside click ──────────────────────────── */
  document.addEventListener('click', e => {
    if (isOpen() && !nav.contains(e.target)) close();
  });
})();
/* ─────────────────────────────────────────────────────────── */

/* ── Scroll-driven animations: fallback IntersectionObserver ─
   Solo activa en navegadores sin soporte nativo (ej. Firefox).
   El CSS nativo tiene prioridad cuando está disponible.
─────────────────────────────────────────────────────────────── */
if (
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !CSS.supports('(animation-timeline: view()) and (animation-range: entry)')
) {
  const ANIMATED = [
    '.commitment-card',
    '.property-card',
    '.value-card',
    '.nosotros-testimonial-list li',
    '.support-card',
    '.support-topic-list li',
    '.support-accordion-item',
  ].join(',');

  const style = document.createElement('style');
  style.textContent = `
    .js-scroll-hidden {
      opacity: 0;
      translate: 0 28px;
      transition: opacity 0.5s ease, translate 0.5s ease;
    }
    .js-scroll-visible {
      opacity: 1;
      translate: 0 0;
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.replace('js-scroll-hidden', 'js-scroll-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(ANIMATED).forEach(el => {
    el.classList.add('js-scroll-hidden');
    observer.observe(el);
  });
}
