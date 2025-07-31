// Este componente se encarga de manejar todo lo relacionado a los turnos:
// muestra los turnos existentes, permite crearlos y también eliminarlos.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)]
import { HttpClient } from '@angular/common/http';
import { Turno } from '../models/turno';      // Modelo de Turno
import { Paciente } from '../models/paciente'; // Modelo de Paciente

@Component({
  selector: 'app-turnos',
  standalone: true, // Forma moderna (sin usar NgModules)
  imports: [CommonModule, FormsModule], // Para ngFor, ngIf, ngModel, etc.
  templateUrl: './turnos.html',
  styleUrl: './turnos.css'
})
export class Turnos {
  // Inyectamos el cliente HTTP con inject() (forma moderna de Angular)
  private http = inject(HttpClient);

  // Arreglo que guarda todos los turnos traídos desde el backend
  turnos: Turno[] = [];

  // Lista de pacientes para el combo al crear un turno
  pacientes: Paciente[] = [];

  // Objeto para el formulario de creación de un turno
  nuevoTurno: {
    fecha: string;
    hora: string;
    razon: string;
    pacienteId: number | null;
  } = {
    fecha: '',
    hora: '',
    razon: '',
    pacienteId: null
  };

  constructor() {
    this.cargarTurnos();
    this.cargarPacientes();
  }

  // Traemos los turnos desde el backend
  cargarTurnos(): void {
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (data) => {
        this.turnos = data;
        console.log('Turnos cargados:', data);
      },
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  // Traemos los pacientes para mostrarlos en el <select>
  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('Pacientes cargados:', data);
      },
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  // Creamos un nuevo turno y lo enviamos al backend
  crearTurno(): void {
    const turnoAEnviar = {
      fecha: this.nuevoTurno.fecha,
      hora: this.nuevoTurno.hora,
      razon: this.nuevoTurno.razon,
      paciente: this.nuevoTurno.pacienteId // El backend espera un paciente con ID
    };

    this.http.post<Turno>('http://localhost:3000/turnos', turnoAEnviar).subscribe({
      next: (turnoCreado) => {
        console.log('Turno creado:', turnoCreado);
        this.turnos.push(turnoCreado); // Agregamos el nuevo turno a la lista
        this.nuevoTurno = { fecha: '', hora: '', razon: '', pacienteId: null }; // Limpiamos el form
      },
      error: (err) => console.error('Error al crear turno:', err)
    });
  }

  // Eliminamos un turno por su ID
  eliminarTurno(id: number): void {
    this.http.delete<void>(`http://localhost:3000/turnos/${id}`).subscribe({
      next: () => {
        this.turnos = this.turnos.filter(t => t.id !== id);
        console.log(`Turno con ID ${id} eliminado`);
      },
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }
}
