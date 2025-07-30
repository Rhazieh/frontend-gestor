// Este archivo es el corazón de la aplicación. Es el componente raíz, el que se monta primero cuando carga el frontend.

import { Component, signal } from '@angular/core'; // importamos lo necesario para que esto sea un componente y para usar signals (como una variable reactiva)
import { RouterOutlet } from '@angular/router'; // esto permite que las vistas cambien según la ruta, sin recargar la página
import { Navbar } from './navbar/navbar'; // importamos el navbar que creamos para mostrarlo en todas las vistas

@Component({
  selector: 'app-root', // este nombre se usa como etiqueta HTML <app-root>, y Angular la reemplaza por este componente
  standalone: true, // esto indica que es un componente independiente, no necesita estar en un módulo
  imports: [RouterOutlet, Navbar], // acá indicamos los componentes que se usan dentro de este (como <router-outlet> y <app-navbar>)
  templateUrl: './app.html', // el HTML que va a renderizarse
  styleUrl: './app.css' // el estilo propio de este componente (aunque por ahora está vacío)
})
export class App {
  // usamos signal() para crear una variable reactiva, aunque ahora solo muestra el título por si se usa más adelante
  protected readonly title = signal('frontend-gestor');
}
