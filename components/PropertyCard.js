/**
 * components/PropertyCard.js — Consorcio Activo
 * Custom Element: <property-card>
 *
 * Light DOM — hereda estilos globales de styles.css.
 * El elemento mismo reemplaza al <li class="property-card"> en la grilla.
 *
 * Atributos:
 *   title    — nombre de la categoría, ej. "Residenciales"
 *   desc     — descripción corta
 *   href     — enlace del botón "Ver más"
 *   img      — ruta de la imagen (opcional; si falta muestra placeholder)
 *   imgalt   — alt de la imagen
 *   accent   — (boolean) pinta el título con --brand (default: true)
 */

class PropertyCard extends HTMLElement {

  static get observedAttributes() {
    return ['title', 'desc', 'href', 'img', 'imgalt', 'accent'];
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback() {
    // Re-render solo si ya está en el DOM
    if (this.isConnected) this.render();
  }

  render() {
    const title   = this.getAttribute('title')  || '';
    const desc    = this.getAttribute('desc')   || '';
    const href    = this.getAttribute('href')   || '#';
    const img     = this.getAttribute('img')    || '';
    const imgalt  = this.getAttribute('imgalt') || title;
    const accent  = this.getAttribute('accent') !== 'false'; // default true

    const figure = img
      ? /* html */`
          <img src="${img}" alt="${imgalt}"
               width="400" height="280" loading="lazy">`
      : /* html */`
          <!--
            IMAGEN PENDIENTE — reemplazar con:
            <img src="images/..." alt="${imgalt}"
                 width="400" height="280" loading="lazy">
          -->
          <div class="img-ph img-ph--property"></div>`;

    this.innerHTML = /* html */`
      <figure class="property-card-img">
        ${figure}
      </figure>
      <div class="property-card-body">
        <h3 ${accent ? 'class="accent"' : ''}>${this._escape(title)}</h3>
        <p>${this._escape(desc)}</p>
        <a href="${href}" class="btn btn-brand btn-sm">Ver más</a>
      </div>
    `;
  }

  /** Escapa texto para evitar XSS al insertar en HTML */
  _escape(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

customElements.define('property-card', PropertyCard);
