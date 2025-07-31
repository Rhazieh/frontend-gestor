// Este componente se encarga de mostrar todos los turnos guardados en el backend.
// Se conecta directamente con la API que corre en localhost:3000/turnos
// y guarda los datos para mostrarlos en la vista turnos.html

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Hay que importarlo si usamos `inject`
import { Turno } from '../models/turno'; // Modelo que define la forma de los datos de turno

@Component({
  selector: 'app-turnos',     // Esta es la etiqueta que se usa para este componente: <app-turnos>
  standalone: true,           // No depende de un NgModule (forma moderna)
  imports: [CommonModule],    // Habilitamos *ngFor, etc.
  templateUrl: './turnos.html', // HTML que se renderiza
  styleUrl: './turnos.css'      // Estilos para esta vista
})
export class Turnos {
  // Inyectamos el servicio HTTP con la nueva forma
  private http = inject(HttpClient);

  // Lista donde se van a guardar los turnos que vengan del backend
  turnos: Turno[] = [];

  constructor() {
    // Apenas se crea el componente, pedimos los turnos al backend
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (data: Turno[]) => {
        console.log('Turnos recibidos:', data); // Para debug
        this.turnos = data;
      },
      error: (err: any) => console.error('Error al obtener turnos:', err)
    });
  }
}
