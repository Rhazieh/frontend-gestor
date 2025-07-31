// Este componente es el navbar principal de la app.
// Sirve para moverse entre las secciones: Pacientes y Turnos.
// Se usa en el archivo app.html con el tag <app-navbar>.

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar', // Este es el nombre que se usa en el HTML: <app-navbar>
  standalone: true,       // Es un componente independiente (no usa NgModules)
  imports: [RouterLink, RouterLinkActive], // Permite usar enlaces de Angular
  templateUrl: './navbar.html',  // HTML que va a renderizar
  styleUrl: './navbar.css'       // CSS para estilizar el navbar
})
export class Navbar {}
