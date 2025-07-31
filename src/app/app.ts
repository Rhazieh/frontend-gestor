// Este es el componente principal de Angular. Es como el "main" del frontend.
// Acá se configura qué cosas se importan, el HTML base y el estilo general.
// Usamos el decorador @Component para indicarle que esta clase es un componente Angular.

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Necesario para poder renderizar las rutas
import { Navbar } from './navbar/navbar'; // Importamos el navbar para que se vea en todas las vistas
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root', // Nombre de etiqueta que se usa en index.html
  standalone: true,     // Esto indica que este componente es independiente (forma moderna)
  imports: [RouterOutlet, Navbar, HttpClientModule],
  templateUrl: './app.html',       // HTML que se va a renderizar
  styleUrl: './app.css'            // Estilos propios del componente
})
export class App {
  // Signal es como una variable reactiva (parecido a BehaviorSubject en RxJS o a useState en React)
  // Por ahora no la usamos mucho, pero sirve para actualizar valores en tiempo real si queremos.
  protected readonly title = signal('frontend-gestor');
}
