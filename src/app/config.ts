// src/app/config.ts
// Autoswitch: en localhost usa 3000; en producción usa Render.
const PROD_API = 'https://backend-gestor-zfez.onrender.com';

export const API_BASE =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : PROD_API;
