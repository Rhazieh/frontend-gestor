// src/app/app.routes.ts
// ──────────────────────────────────────────────────────────────────────
// 📌 Definición de rutas (enrutador) del frontend.
// - Cuando la URL cambia, Angular decide qué componente dibujar en <router-outlet>.
// - Acá mapeamos cada "path" a un componente concreto.
//
// Pistas rápidas:
// - '' (cadena vacía) es la raíz del sitio: https://tu-sitio/
// - redirectTo manda a otra ruta sin recargar la página.
// - pathMatch: 'full' significa “solo redirigí si la URL está VACÍA”.
// - Si quisieras lazy-loading, esto podría dividirse en archivos/routers por feature,
//   pero para este proyecto alcanza con rutas simples.
// ──────────────────────────────────────────────────────────────────────

import { Routes } from '@angular/router';
import { Pacientes } from './pacientes/pacientes';
import { Turnos } from './turnos/turnos';

export const routes: Routes = [
  // ⛳ Raíz -> redirige a /pacientes
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },

  // 👥 Lista/ABM de Pacientes
  { path: 'pacientes', component: Pacientes },

  // 📅 Lista/ABM de Turnos
  { path: 'turnos', component: Turnos },

  // (Opcional recomendado) Ruta comodín 404:
  // { path: '**', redirectTo: 'pacientes' } // <- dejar comentada si no la necesitás
];