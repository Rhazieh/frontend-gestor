// Este componente se encarga de mostrar la lista de pacientes.
// También permite crear nuevos pacientes con un formulario simple.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para usar [(ngModel)]
import { PacientesService } from './pacientes.service'; // Servicio que se conecta con el backend
import { Paciente } from '../models/paciente'; // Modelo con la estructura de un paciente

@Component({
  selector: 'app-pacientes', // Esta es la etiqueta que representa este componente
  standalone: true,          // Usamos el modo moderno sin NgModules
  imports: [CommonModule, FormsModule], // CommonModule para *ngFor, FormsModule para [(ngModel)]
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes {
  // Array donde vamos a guardar todos los pacientes que vienen del backend
  pacientes: Paciente[] = [];

  // Objeto temporal donde se guarda lo que el usuario escribe en el formulario
  nuevoPaciente: Partial<Paciente> = {
    nombre: '',
    email: '',
    telefono: ''
  };

  // Inyectamos el servicio que se comunica con el backend
  constructor(private pacientesService: PacientesService) {}

  // Apenas se carga el componente, pedimos todos los pacientes
  ngOnInit(): void {
    this.pacientesService.getPacientes().subscribe({
      next: (data) => {
        console.log('Pacientes recibidos:', data); // Por si queremos ver en consola
        this.pacientes = data; // Guardamos los datos en el array
      },
      error: (err) => console.error('Error al obtener pacientes:', err)
    });
  }

  // Esta función se ejecuta cuando el usuario envía el formulario
  crearPaciente(): void {
    this.pacientesService.crearPaciente(this.nuevoPaciente).subscribe({
      next: (pacienteCreado) => {
        console.log('Paciente creado:', pacienteCreado); // Debug
        this.pacientes.push(pacienteCreado); // Lo agregamos a la tabla directamente
        // Limpiamos el formulario para que se puedan seguir creando más pacientes
        this.nuevoPaciente = { nombre: '', email: '', telefono: '' };
      },
      error: (err) => console.error('Error al crear paciente:', err)
    });
  }
  eliminarPaciente(id: number): void {
  this.pacientesService.eliminarPaciente(id).subscribe({
    next: () => {
      console.log('Paciente eliminado con ID:', id);
      this.pacientes = this.pacientes.filter(p => p.id !== id); // Lo sacamos de la lista
    },
    error: (err) => console.error('Error al eliminar paciente:', err)
  });
}
}
