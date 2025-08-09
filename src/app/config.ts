// src/app/config.ts
const PROD_API = 'https://backend-gestor-zfez.onrender.com';

export const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : PROD_API;
