// src/main.ts
// ──────────────────────────────────────────────────────────────
// 📌 Punto de arranque del frontend (bootstrap).
// - Crea la app Angular a partir del componente raíz `App`.
// - Inyecta servicios globales (HTTP y Router) para toda la app.
// - NO usa NgModules; es el enfoque "standalone" moderno de Angular.
// ──────────────────────────────────────────────────────────────

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { App } from './app/app';
import { routes } from './app/app.routes';

// 🚀 Arranca la aplicación con el componente raíz `App`
// y registra proveedores globales:
//   - provideHttpClient(): habilita HttpClient en toda la app.
//   - provideRouter(routes): conecta el enrutador con nuestras rutas.
bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});

// 💡 Si en algún momento querés añadir interceptores HTTP globales,
// o más providers (i18n, animations, etc.), se agregan en este objeto.
// Ejemplo (comentado):
// providers: [
//   provideHttpClient(withInterceptors([miInterceptor])),
//   provideRouter(routes),
//   provideAnimations()
// ]