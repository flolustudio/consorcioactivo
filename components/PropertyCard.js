/**
 * components/PropertyCard.js — Consorcio Activo
 * Web Component que lee del store global por data-id.
 *
 * Uso: <property-card data-id="1"></property-card>
 * Requiere que window.app.store.properties esté cargado.
 *
 * Soporte de imágenes:
 *   - 1 imagen  → <img> simple, sin controles
 *   - N imágenes → carrusel CSS scroll-snap con flechas y puntos
 */

class PropertyCard extends HTMLElement {
  connectedCallback() {
    if (this._rendered) return;

    if (window.app?.store?.properties) {
      this._render();
    } else {
      window.addEventListener('apppropertieschange', () => this._render(), { once: true });
    }
  }

  _render() {
    this._rendered = true;
    const id = parseInt(this.dataset.id, 10);
    const p  = window.app?.store?.properties?.find(x => x.id === id);
    if (!p) return;

    const isAlquilada  = p.estado === 'alquilada';
    const esConsulta   = !p.precio || p.precio === 0;
    const precioFmt    = esConsulta
      ? 'Consultar precio'
      : '$' + p.precio.toLocaleString('es-AR') + '/mes';

    const WPP_NUM  = '5492995880858';
    // encodeURIComponent produce solo chars URL-safe (%XX, alfanum, -_.!~*'())
    // ninguno es HTML-especial → inserción en href dentro de innerHTML es segura.
    const wppMsg   = encodeURIComponent(`Hola! Consulto por la propiedad: ${p.titulo} en ${p.ubicacion}`);

    // Specs: superficie, dormitorios, baños, features
    const specItems = [
      p.superficie    ? `${p.superficie}m²` : '',
      p.dormitorios   ? `${p.dormitorios} Dorm.` : '',
      p.banos         ? `${p.banos} Baño${p.banos !== 1 ? 's' : ''}` : '',
      ...(p.features || []).map(f => this._esc(f)),
    ].filter(Boolean);

    const specsHTML = specItems
      .map(s => `<span class="property-spec-item">${s}</span>`)
      .join('<span class="property-spec-sep" aria-hidden="true">|</span>');

    const overlay = isAlquilada
      ? `<div class="property-overlay" aria-hidden="true"><span>ALQUILADA</span></div>` : '';

    const cta = isAlquilada
      ? `<span class="btn btn-sm btn-alquilada">Alquilada</span>`
      : `<a href="https://wa.me/${WPP_NUM}?text=${wppMsg}"
            class="btn btn-brand btn-sm prop-card-cta"
            target="_blank" rel="noopener noreferrer">
          Consultar por WPP
         </a>`;

    // Soporte para imagenes[] (nuevo) con fallback a imagen (legado)
    const images = Array.isArray(p.imagenes) && p.imagenes.length
      ? p.imagenes
      : (p.imagen ? [p.imagen] : []);

    const newBadge = p.nuevo ? `<span class="prop-badge-new" aria-label="Novedad">NEW</span>` : '';

    const figureHTML = images.length > 1
      ? this._buildCarousel(images, p.titulo, overlay, newBadge)
      : this._buildSingleImage(images[0] || '', p.titulo, overlay, newBadge);

    this.innerHTML = `
      ${figureHTML}
      <div class="property-card-body">
        <div class="property-card-top">
          <h3>${this._esc(p.titulo)}</h3>
          <p class="property-location">${this._esc(p.ubicacion)}</p>
        </div>
        ${specsHTML ? `<div class="property-card-specs">${specsHTML}</div>` : ''}
        <div class="property-card-footer">
          <div class="property-price-block">
            ${esConsulta ? '' : '<span class="property-price-label">Desde</span>'}
            <p class="property-price">${precioFmt}</p>
          </div>
          ${cta}
        </div>
      </div>`;

    if (images.length > 1) this._initCarousel();
  }

  /* ── HTML de imagen simple ───────────────────────────────── */
  _buildSingleImage(src, titulo, overlay, badge = '') {
    return `
      <figure class="property-card-img">
        <img src="${this._esc(src)}" alt="${this._esc(titulo)}"
             width="400" height="260" loading="lazy">
        ${badge}
        ${overlay}
      </figure>`;
  }

  /* ── HTML del carrusel ───────────────────────────────────── */
  _buildCarousel(images, titulo, overlay, badge = '') {
    const total  = images.length;
    const slides = images.map((src, i) => `
      <div class="carousel-slide" role="group"
           aria-roledescription="slide"
           aria-label="Foto ${i + 1} de ${total}">
        <img src="${this._esc(src)}"
             alt="${this._esc(titulo)} — foto ${i + 1}"
             width="400" height="260"
             loading="${i === 0 ? 'eager' : 'lazy'}">
        ${i === 0 ? badge : ''}
      </div>`).join('');

    const dots = images.map((_, i) =>
      `<span class="carousel-dot${i === 0 ? ' carousel-dot--active' : ''}"
             data-index="${i}" aria-hidden="true"></span>`
    ).join('');

    return `
      <figure class="property-card-img property-card-img--carousel"
              role="region" aria-roledescription="carrusel"
              aria-label="Fotos de la propiedad">
        <div class="carousel-track">${slides}</div>
        <button class="carousel-btn carousel-btn--prev" type="button"
                aria-label="Foto anterior">&#8249;</button>
        <button class="carousel-btn carousel-btn--next" type="button"
                aria-label="Foto siguiente">&#8250;</button>
        <div class="carousel-dots">${dots}</div>
        ${overlay}
      </figure>`;
  }

  /* ── Lógica del carrusel (se llama una vez tras innerHTML) ── */
  _initCarousel() {
    const track = this.querySelector('.carousel-track');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const dots   = this.querySelectorAll('.carousel-dot');
    const total  = slides.length;
    let current  = 0;

    const goTo = (idx) => {
      current = ((idx % total) + total) % total;
      track.scrollTo({ left: current * track.offsetWidth, behavior: 'smooth' });
      dots.forEach((d, i) => d.classList.toggle('carousel-dot--active', i === current));
    };

    this.querySelector('.carousel-btn--prev')?.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      goTo(current - 1);
    });

    this.querySelector('.carousel-btn--next')?.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      goTo(current + 1);
    });

    dots.forEach((dot, i) =>
      dot.addEventListener('click', () => goTo(i))
    );

    // Sincroniza puntos al hacer scroll manual (touch / drag)
    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const idx = Math.round(track.scrollLeft / track.offsetWidth);
        if (idx !== current) {
          current = idx;
          dots.forEach((d, i) => d.classList.toggle('carousel-dot--active', i === current));
        }
      }, 50);
    }, { passive: true });
  }

  /* ── Utilidad XSS ───────────────────────────────────────── */
  _esc(s = '') {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }
}

customElements.define('property-card', PropertyCard);
