
// src/app/app.ts
// ─────────────────────────────────────────────────────────────────────
//  Componente raíz de Angular (standalone)
// - Es el punto de arranque visual del frontend.
// - Importa el navbar y habilita el enrutador para que <router-outlet>
//   pueda renderizar las páginas (Pacientes / Turnos).
// - No tiene lógica de negocio: solo “arma” la app y expone el template.
//
// Tip rápido:
// - Este componente se bootstrapea en src/main.ts (bootstrapApplication(App))
// - Su HTML vive en src/app/app.html y sus estilos en src/app/app.css
// ──────────────────────────────────────────────────────────────────────

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Necesario para dibujar la ruta activa (<router-outlet>)
import { Navbar } from './navbar/navbar';       // Componente de navegación superior
import { HttpClientModule } from '@angular/common/http'; // Habilita HttpClient en toda la app

@Component({
  selector: 'app-root',              // Etiqueta que se usa en index.html: <app-root></app-root>
  standalone: true,                  // Componente independiente (sin NgModule)
  imports: [RouterOutlet, Navbar, HttpClientModule], // Módulos/Componentes que este componente usa
  templateUrl: './app.html',         // Vista principal (incluye <app-navbar> y <router-outlet>)
  styleUrl: './app.css'              // Estilos específicos del componente raíz
})
export class App {
  //  signal(): estado reactivo nativo de Angular.
  // No lo usamos en la UI por ahora, pero queda como ejemplo.
  protected readonly title = signal('frontend-gestor');
}