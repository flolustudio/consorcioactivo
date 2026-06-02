/**
 * components/PropertyCard.js — Consorcio Activo
 * Web Component que lee del store global por data-id.
 *
 * Uso: <property-card data-id="1"></property-card>
 * Requiere que window.app.store.properties esté cargado.
 */

class PropertyCard extends HTMLElement {
  connectedCallback() {
    // Flag para evitar doble render si el elemento se mueve en el DOM.
    if (this._rendered) return;

    if (window.app?.store?.properties) {
      this._render();
    } else {
      window.addEventListener('apppropertieschange', () => this._render(), { once: true });
    }
  }

  disconnectedCallback() {
    // Mantiene el flag al moverse, pero resetea si se saca del DOM definitivamente
    // (el browser lo llama antes de moverlo; connectedCallback lo vuelve a llamar)
  }

  _render() {
    this._rendered = true;
    const id = parseInt(this.dataset.id, 10);
    const p  = window.app?.store?.properties?.find(x => x.id === id);
    if (!p) return;

    const isAlquilada = p.estado === 'alquilada';

    // Precio formateado: 860000 → $860.000/mes
    const precioFmt = '$' + p.precio.toLocaleString('es-AR') + '/mes';

    // Specs: superficie, baños, features
    const specItems = [
      p.superficie ? `${p.superficie}m²` : '',
      p.banos      ? `${p.banos} Baño${p.banos !== 1 ? 's' : ''}` : '',
      ...(p.features || []).map(f => this._esc(f)),
    ].filter(Boolean);

    const specsHTML = specItems
      .map(s => `<span class="property-spec-item">${s}</span>`)
      .join('<span class="property-spec-sep" aria-hidden="true">|</span>');

    const overlay = isAlquilada
      ? `<div class="property-overlay" aria-hidden="true"><span>ALQUILADA</span></div>` : '';

    const cta = isAlquilada
      ? `<span class="btn btn-sm btn-alquilada">Alquilada</span>`
      : `<a href="contacto.html?id=${p.id}&tipo=${p.tipo}" class="btn btn-brand btn-sm">Ver más</a>`;

    this.innerHTML = `
      <figure class="property-card-img">
        <img src="${this._esc(p.imagen)}" alt="${this._esc(p.titulo)}"
             width="400" height="260" loading="lazy">
        ${overlay}
      </figure>
      <div class="property-card-body">
        <div class="property-card-top">
          <h3>${this._esc(p.titulo)}</h3>
          <p class="property-location">${this._esc(p.ubicacion)}</p>
        </div>
        ${specsHTML ? `<div class="property-card-specs">${specsHTML}</div>` : ''}
        <div class="property-card-footer">
          <div class="property-price-block">
            <span class="property-price-label">Desde</span>
            <p class="property-price">${precioFmt}</p>
          </div>
          ${cta}
        </div>
      </div>`;
  }

  _esc(s = '') {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

customElements.define('property-card', PropertyCard);
