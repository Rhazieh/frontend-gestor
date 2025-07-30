// Este componente se encarga de mostrar el menú superior (navbar) del sistema.
// Tiene un título y enlaces para navegar entre las secciones principales.

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar', // Esto se usa como etiqueta HTML: <app-navbar>
  standalone: true, // Angular moderno, no necesitamos NgModule para esto.
  imports: [RouterLink, RouterLinkActive], // Importamos las directivas necesarias para usar rutas.
  templateUrl: './navbar.html', // Acá va la estructura HTML (la vista).
  styleUrl: './navbar.css' // Acá le damos el estilo visual (colores, tamaño, etc.).
})
export class Navbar {
  // No necesitamos lógica interna por ahora, todo es estático.
}
