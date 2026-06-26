/**
 * services/API.js — Consorcio Activo
 * Capa de datos. Fase 1: módulo JS local (funciona con file:// y http://).
 * Fase 2: reemplazar fetchProperties() por fetch al backend real.
 */

import DATA from '../data/properties.js?v=20260626-01';

const API = {
  // Fase 2: url: 'https://mi-api.com/properties',

  fetchProperties: async () => {
    // Fase 1: retorna el módulo directamente — sin fetch, sin CORS, sin servidor.
    // Fase 2: reemplazar por:
    //   const res = await fetch(API.url);
    //   if (!res.ok) throw new Error(`API error: ${res.status}`);
    //   return res.json();
    return DATA;
  },

  // ── Fase 2 — CRUD admin ─────────────────────────────────────
  // createProperty: async (data) => {
  //   const res = await fetch(API.url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   });
  //   return res.json();
  // },

  // toggleProperty: async (id, activa) => {
  //   const res = await fetch(`${API.url}/${id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ activa }),
  //   });
  //   return res.json();
  // },

  // deleteProperty: async (id) => {
  //   await fetch(`${API.url}/${id}`, { method: 'DELETE' });
  // },
};

export default API;
