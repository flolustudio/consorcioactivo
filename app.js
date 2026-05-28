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
}

/* ── Comportamiento mobile nav (fallback si app-nav no carga) ── */
(() => {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelectorAll('.nav-links a');

  if (!nav || !toggle) return;

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
