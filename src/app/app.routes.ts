// Acá definimos las rutas del proyecto.
// Cuando entres al inicio ("/") te redirige automáticamente a "/pacientes".
// Tenés dos rutas principales: pacientes y turnos.

import { Routes } from '@angular/router';
import { Pacientes } from './pacientes/pacientes';
import { Turnos } from './turnos/turnos';

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
  { path: 'pacientes', component: Pacientes },
  { path: 'turnos', component: Turnos }
];
