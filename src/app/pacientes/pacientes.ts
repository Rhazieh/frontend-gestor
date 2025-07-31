// Este componente se encarga de mostrar la lista de pacientes.
// Usa el servicio PacientesService para conectarse con el backend
// y guarda los datos que vienen de la API en un array para mostrarlos en el HTML.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesService } from './pacientes.service'; // Servicio que hace las peticiones al backend
import { Paciente } from '../models/paciente'; // Modelo que define cómo es un paciente

@Component({
  selector: 'app-pacientes', // Etiqueta que representa este componente
  standalone: true,          // Forma moderna, no usa NgModules
  imports: [CommonModule],   // Para poder usar *ngFor y estructuras de Angular
  templateUrl: './pacientes.html', // HTML que se renderiza para mostrar la lista
  styleUrl: './pacientes.css'      // Estilos de esta vista
})
export class Pacientes {
  // Acá guardamos los pacientes que vienen desde el backend
  pacientes: Paciente[] = [];

  // Inyectamos el servicio de pacientes que tiene el método para traerlos
  constructor(private pacientesService: PacientesService) {}

  // Este método se ejecuta apenas se carga el componente
  ngOnInit(): void {
    // Pedimos los pacientes al backend y los guardamos en el array
    this.pacientesService.getPacientes().subscribe({
      next: (data: Paciente[]) => {
        console.log('Pacientes recibidos:', data); // Consola para ver si llegó bien
        this.pacientes = data;
      },
      error: (err: any) => console.error('Error al obtener pacientes:', err)
    });
  }
}
