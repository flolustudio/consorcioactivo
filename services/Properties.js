/**
 * services/Properties.js — Consorcio Activo
 * Carga propiedades desde la API y las setea en el store.
 * El setter del Proxy dispara "apppropertieschange" automáticamente.
 */

import API from './API.js?v=20260613-05';

export async function loadProperties() {
  try {
    window.app.store.properties = await API.fetchProperties();
  } catch (err) {
    console.error('[Properties] Error cargando propiedades:', err);
    window.app.store.properties = [];
  }
}
