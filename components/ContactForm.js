/**
 * components/ContactForm.js — Consorcio Activo
 * Custom Element: <contact-form>
 *
 * Shadow DOM — estilos encapsulados; hereda CSS custom properties del :root.
 * Usa Constraint Validation API nativa (sin libs externas).
 *
 * Dispatcha evento `ca:form-submitted` con los datos del formulario
 * una vez que la validación pasa.
 *
 * Atributos:
 *   action  — URL de envío (default: '#')
 *   method  — GET | POST (default: POST)
 */

const TEMPLATE = /* html */`
<style>
  /* ─── CSS custom props heredados del :root de la página ─── */
  :host {
    display: block;
    --c-brand:    var(--brand,       #FBC603);
    --c-accent:   var(--brand-accent,#E7941D);
    --c-text:     var(--text-primary,#1C1B1F);
    --c-muted:    var(--text-secondary,#555);
    --c-surface:  var(--surface-0,   #fff);
    --c-border:   var(--border,      #E0DFE4);
    --c-error:    #c0392b;
    --radius:     var(--radius-md,   0.75rem);
    --font:       var(--font-body,   system-ui, sans-serif);
    --font-d:     var(--font-display,system-ui, sans-serif);
  }

  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem 1.5rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .field--full { grid-column: 1 / -1; }

  label {
    font-family: var(--font-d);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--c-text);
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--c-surface);
    border: 1.5px solid var(--c-border);
    border-radius: var(--radius);
    font-family: var(--font);
    font-size: 0.95rem;
    color: var(--c-text);
    transition: border-color 0.15s ease;
    outline: none;
    appearance: none;
  }
  input::placeholder,
  textarea::placeholder { color: #aaa; }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--c-brand);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-brand) 20%, transparent);
  }

  /* Estado inválido (solo tras interacción) */
  input:user-invalid,
  select:user-invalid,
  textarea:user-invalid {
    border-color: var(--c-error);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-error) 15%, transparent);
  }

  .field-error {
    font-size: 0.78rem;
    color: var(--c-error);
    min-height: 1em;
    display: none;
  }
  input:user-invalid ~ .field-error,
  select:user-invalid ~ .field-error,
  textarea:user-invalid ~ .field-error {
    display: block;
  }

  textarea {
    resize: vertical;
    min-height: 140px;
    line-height: 1.55;
  }

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231C1B1F' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
    cursor: pointer;
  }

  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .btn-submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.78rem 2rem;
    background: var(--c-brand);
    color: var(--c-text);
    border: 2px solid var(--c-brand);
    border-radius: 999px;
    font-family: var(--font-d);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s, border-color 0.15s;
  }
  .btn-submit:hover {
    background: var(--c-accent);
    border-color: var(--c-accent);
    transform: translateY(-2px);
  }
  .btn-submit:active { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .form-status {
    font-size: 0.9rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius);
    display: none;
  }
  .form-status.success {
    display: block;
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }
  .form-status.error {
    display: block;
    background: #ffebee;
    color: var(--c-error);
    border: 1px solid #ffcdd2;
  }

  :focus-visible {
    outline: 3px solid var(--c-brand);
    outline-offset: 2px;
    border-radius: calc(var(--radius) + 2px);
  }

  @media (max-width: 560px) {
    form { grid-template-columns: 1fr; }
    .field--full { grid-column: 1; }
  }
</style>

<form novalidate>
  <div class="field">
    <label for="cf-nombre">Nombre completo</label>
    <input id="cf-nombre" name="nombre" type="text"
           placeholder="Tu nombre" required minlength="2" autocomplete="name">
    <span class="field-error">El nombre es obligatorio</span>
  </div>

  <div class="field">
    <label for="cf-email">Correo electrónico</label>
    <input id="cf-email" name="email" type="email"
           placeholder="tu@correo.com" required autocomplete="email">
    <span class="field-error">Ingresá un email válido</span>
  </div>

  <div class="field">
    <label for="cf-telefono">Teléfono <span aria-hidden="true">(opcional)</span></label>
    <input id="cf-telefono" name="telefono" type="tel"
           placeholder="+54 299 000-0000" autocomplete="tel">
  </div>

  <div class="field">
    <label for="cf-asunto">Asunto</label>
    <select id="cf-asunto" name="asunto" required>
      <option value="" disabled selected>Seleccioná un tema</option>
      <option value="administracion">Administración de consorcio</option>
      <option value="propiedades">Consulta sobre propiedades</option>
      <option value="soporte">Soporte técnico</option>
      <option value="presupuesto">Solicitud de presupuesto</option>
      <option value="otro">Otro</option>
    </select>
    <span class="field-error">Seleccioná un asunto</span>
  </div>

  <div class="field field--full">
    <label for="cf-mensaje">Mensaje</label>
    <textarea id="cf-mensaje" name="mensaje"
              placeholder="Contanos en qué podemos ayudarte…"
              required minlength="10"></textarea>
    <span class="field-error">El mensaje debe tener al menos 10 caracteres</span>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn-submit">
      Enviar mensaje
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <span class="form-status" role="status" aria-live="polite"></span>
  </div>
</form>
`;

class ContactForm extends HTMLElement {

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = TEMPLATE;
    this._bindEvents();
  }

  _bindEvents() {
    const form   = this.shadowRoot.querySelector('form');
    const btn    = this.shadowRoot.querySelector('.btn-submit');
    const status = this.shadowRoot.querySelector('.form-status');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validación nativa
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form));

      btn.disabled = true;
      btn.textContent = 'Enviando…';

      try {
        const action = this.getAttribute('action') || '#';
        const method = (this.getAttribute('method') || 'POST').toUpperCase();

        if (action !== '#') {
          await fetch(action, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }

        // Evento público para que la página pueda reaccionar
        this.dispatchEvent(new CustomEvent('ca:form-submitted', {
          detail: data,
          bubbles: true,
          composed: true,
        }));

        status.className = 'form-status success';
        status.textContent = '¡Mensaje enviado! Te respondemos a la brevedad.';
        form.reset();

      } catch {
        status.className = 'form-status error';
        status.textContent = 'Hubo un error. Por favor intentá nuevamente.';
      } finally {
        btn.disabled = false;
        btn.innerHTML = `Enviar mensaje
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
      }
    });
  }
}

customElements.define('contact-form', ContactForm);
