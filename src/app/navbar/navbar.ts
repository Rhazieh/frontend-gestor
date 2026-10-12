// src/app/navbar/navbar.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Componente Navbar
// Qué es: barra de navegación superior presente en toda la app.
//
// Para qué sirve:
// - Mostrar links a las dos secciones principales: Pacientes y Turnos.
// - Navegar sin recargar la página gracias al router de Angular.
//
// Puntos clave:
// - `standalone: true`: este componente no depende de un NgModule (forma moderna).
// - `imports: [RouterLink, RouterLinkActive]`: habilita directivas de enrutado
//   que se usan en el template (navbar.html).
// - `selector: 'app-navbar'`: se inserta colocando <app-navbar></app-navbar>
//   (lo hacemos en src/app/app.html).
//
// Dónde se estiliza: src/app/navbar/navbar.css
// Dónde está el HTML: src/app/navbar/navbar.html
// ─────────────────────────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',                 // Nombre de etiqueta para usar en HTML
  standalone: true,                       // Componente independiente (sin NgModule)
  imports: [RouterLink, RouterLinkActive],// Habilita routerLink y routerLinkActive en el template
  templateUrl: './navbar.html',           // Vista del navbar (enlaces)
  styleUrl: './navbar.css'                // Estilos del navbar
})
export class Navbar {}