// src/main.ts
// ──────────────────────────────────────────────────────────────
//  Punto de arranque del frontend (bootstrap).
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

//  Si en algún momento querés añadir interceptores HTTP globales,
// o más providers (i18n, animations, etc.), se agregan en este objeto.
// Ejemplo (comentado):
// providers: [
//   provideHttpClient(withInterceptors([miInterceptor])),
//   provideRouter(routes),
//   provideAnimations()
// ]

/**
 * Guía de lectura (Frontend - Angular standalone)
 * ----------------------------------------------------------------------------
 * ¿Qué hay acá?
 * - Bootstrap de la app (sin NgModules), router y HttpClient global.
 *
 * ¿Por dónde empiezo a leer?
 * 1) src/app/app.ts
 *    - Componente raíz (standalone). Renderiza navbar + <router-outlet>.
 * 2) src/app/app.routes.ts
 *    - Definición de rutas: 'pacientes' y 'turnos'.
 * 3) src/app/pacientes/* y src/app/turnos/*
 *    - Cada feature tiene componente + servicio + HTML/CSS.
 * 4) src/app/config.ts
 *    - API_BASE: decide si apuntar a http://localhost:3000 (dev) o Render (prod).
 *
 * Flujo típico:
 * - Un componente (p.ej. Pacientes) llama a su service -> HttpClient
 *   hace la request usando API_BASE -> backend responde -> el componente
 *   actualiza el estado y el template refleja los cambios.
 *
 * Archivos clave (lectura sugerida):
 * - src/app/pacientes/pacientes.ts / .html / .css
 * - src/app/pacientes/pacientes.service.ts
 * - src/app/turnos/turnos.ts / .html / .css
 * - src/app/turnos/turnos.service.ts
 * - src/app/config.ts
 *
 * Extensiones simples:
 * - Interceptores para manejar errores globales o auth tokens.
 * - Guards de rutas si agregás autenticación.
 * - Lazy loading si crecen las features.
 */