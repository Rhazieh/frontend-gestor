// Este archivo define las rutas de la app. O sea, qué componente se carga según la URL.

import { Routes } from '@angular/router'; // importamos la estructura que define las rutas
import { Pacientes } from './pacientes/pacientes'; // importamos el componente que se va a mostrar en /pacientes
import { Turnos } from './turnos/turnos'; // lo mismo para /turnos

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' }, // si entras a / redirige automáticamente a /pacientes
  { path: 'pacientes', component: Pacientes }, // esta ruta carga el componente Pacientes
  { path: 'turnos', component: Turnos } // esta ruta carga el componente Turnos
];
