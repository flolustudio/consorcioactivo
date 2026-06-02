/**
 * services/PropertyStore.js — Consorcio Activo
 * Estado global reactivo con Proxy.
 * Dispara eventos cuando cambian properties o filtro.
 */

const Store = {
  properties: null,   // null mientras carga, luego array completo
  filtro: 'todos',    // 'residencial' | 'oficina' | 'comercial' | 'todos'
};

const PropertyStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;

    if (property === 'properties') {
      window.dispatchEvent(new CustomEvent('apppropertieschange'));
    }
    if (property === 'filtro') {
      window.dispatchEvent(new CustomEvent('appfiltrochange'));
    }
    return true;
  },
});

export default PropertyStore;
