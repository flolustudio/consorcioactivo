/**
 * components/AppNav.js — Consorcio Activo
 * Custom Element: <app-nav current="home">
 *
 * Light DOM — los estilos globales de styles.css aplican directamente.
 * El componente es el <header> del sitio. Maneja su propio toggle mobile.
 *
 * Atributo `current`: home | nosotros | propiedades | soporte | contacto
 */

const NAV_LINKS = [
  { id: 'home',         label: 'Home',         href: 'index.html'       },
  { id: 'nosotros',     label: 'Nosotros',     href: 'nosotros.html'    },
  { id: 'propiedades',  label: 'Propiedades',  href: 'propiedades.html' },
  { id: 'soporte',      label: 'Soporte',      href: 'soporte.html'     },
  /* Solo visible en el dropdown mobile — oculto en desktop vía CSS */
  { id: 'contacto',     label: 'Contáctanos',  href: 'contacto.html',   mobileOnly: true },
  { id: 'expensas',     label: 'Expensas Online', href: 'https://propietarios.expensasonline.pro/#/login', external: true },
];

class AppNav extends HTMLElement {

  static get observedAttributes() { return ['current']; }

  /* ── Lifecycle ─────────────────────────────────────────── */
  connectedCallback() {
    // Progressive enhancement:
    // Si el HTML ya está en el DOM (renderizado estático en la página),
    // no sobreescribimos — solo añadimos el comportamiento interactivo.
    // Si el elemento está vacío, renderizamos dinámicamente.
    if (!this.querySelector('.nav')) {
      this.render();
    }
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'current' && oldVal !== newVal && this.querySelector('.nav')) {
      this._updateCurrent(newVal);
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click',   this._onDocClick);
    document.removeEventListener('keydown', this._onKeydown);
  }

  /* ── Render ─────────────────────────────────────────────── */
  render() {
    const current = this.getAttribute('current') ?? 'home';
    const logoHref = current === 'home' ? '#inicio' : 'index.html';
    const links = NAV_LINKS.map(({ id, label, href, mobileOnly, external }) => {
      const active   = id === current ? ' aria-current="page"' : '';
      const liClass  = mobileOnly ? ' class="nav-link--mobile"' : '';
      const extAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<li${liClass}><a href="${href}"${extAttrs}${active}>${label}</a></li>`;
    }).join('\n        ');
    const ctaCurrent = current === 'contacto' ? ' aria-current="page"' : '';

    this.innerHTML = /* html */`
      <nav class="nav" aria-label="Navegación principal">

        <a href="${logoHref}" class="nav__logo" aria-label="Consorcio Activo — inicio">
          <img src="public/images/logo horizontal-26-06.png" alt="Consorcio Activo"
               width="66" height="40">
        </a>

        <ul class="nav-links" role="list" id="nav-links">
          ${links}
        </ul>

        <a href="contacto.html" class="btn btn-brand nav-cta"${ctaCurrent}>Contáctanos</a>

        <button class="nav-toggle" aria-label="Abrir menú"
                aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>

      </nav>
    `;
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  get _nav()    { return this.querySelector('.nav'); }
  get _toggle() { return this.querySelector('.nav-toggle'); }
  get _links()  { return this.querySelectorAll('.nav-links a'); }

  _isOpen()  { return this._nav?.classList.contains('is-open'); }

  _open() {
    this._nav?.classList.add('is-open');
    this._toggle?.setAttribute('aria-expanded', 'true');
    this._toggle?.setAttribute('aria-label', 'Cerrar menú');
  }

  _close() {
    this._nav?.classList.remove('is-open');
    this._toggle?.setAttribute('aria-expanded', 'false');
    this._toggle?.setAttribute('aria-label', 'Abrir menú');
  }

  _updateCurrent(current) {
    this._links.forEach(a => {
      const page = NAV_LINKS.find(l => a.getAttribute('href') === l.href);
      if (page?.id === current) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* ── Event binding ──────────────────────────────────────── */
  _bindEvents() {
    // Toggle button
    this._toggle?.addEventListener('click', () => {
      this._isOpen() ? this._close() : this._open();
    });

    // Cierra al hacer clic en un enlace
    this._links.forEach(a => a.addEventListener('click', () => this._close()));

    // Escape
    this._onKeydown = e => {
      if (e.key === 'Escape' && this._isOpen()) {
        this._close();
        this._toggle?.focus();
      }
    };
    document.addEventListener('keydown', this._onKeydown);

    // Clic fuera del nav
    this._onDocClick = e => {
      if (this._isOpen() && !this.contains(e.target)) this._close();
    };
    document.addEventListener('click', this._onDocClick);
  }
}

customElements.define('app-nav', AppNav);
