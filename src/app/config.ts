
// src/app/config.ts
// -----------------------------------------------------------------------------
// Config centralizada del BACKEND para el frontend (Angular).
// Objetivo: tener una sola constante (API_BASE) que apunte al backend correcto,
// sea en desarrollo local o en producción (Netlify + Render).
//
// ¿Cómo decide?
//  - Si estamos en el navegador y el hostname es 'localhost' o '127.0.0.1'
//    -> usa 'http://localhost:3000' (tu backend local).
//  - En cualquier otro caso
//    -> usa la URL de Render (producción).
//
// Nota: el chequeo `typeof window !== 'undefined'` evita errores en entornos
// sin DOM (tests, SSR, prerender), donde `window` no existe.
// -----------------------------------------------------------------------------

// URL del backend en PRODUCCIÓN (Render)
const PROD_API = 'https://backend-gestor-zfez.onrender.com';

// API_BASE es la base que usarán los servicios del front para hacer fetch/HTTP.
export const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000' // Desarrollo local
    : PROD_API;               // Producción (Render)

// -----------------------------------------------------------------------------
//  ¿Cómo se usa?
//   import { API_BASE } from '../config';
//   this.http.get(`${API_BASE}/pacientes`)
//   this.http.post(`${API_BASE}/turnos`, body) ...
//
// Ventaja: si mañana cambia la URL del backend, la tocás acá una sola vez.
// -----------------------------------------------------------------------------