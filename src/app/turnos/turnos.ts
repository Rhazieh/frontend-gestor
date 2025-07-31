// Este componente maneja todo lo relacionado con los turnos:
// muestra, crea, edita y elimina turnos.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Turno } from '../models/turno';
import { Paciente } from '../models/paciente';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css'
})
export class Turnos {
  private http = inject(HttpClient);

  turnos: Turno[] = [];
  pacientes: Paciente[] = [];

  filtroFecha: string = '';

  nuevoTurno = {
    fecha: '',
    hora: '',
    razon: '',
    pacienteId: null as number | null
  };

  turnoEditando: Turno | null = null;

  constructor() {
    this.cargarTurnos();
    this.cargarPacientes();
  }

  // Cargar turnos desde el backend
  cargarTurnos(): void {
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (data) => {
        this.turnos = data;
        console.log('Turnos cargados:', data);
      },
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  // Cargar pacientes desde el backend
  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('Pacientes cargados:', data);
      },
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  // Filtro de turnos por fecha
  get turnosFiltrados(): Turno[] {
    if (!this.filtroFecha) return this.turnos;

    return this.turnos.filter(t => {
      const fechaTurno = new Date(t.fecha).toISOString().split('T')[0];
      return fechaTurno === this.filtroFecha;
    });
  }

  // Crear nuevo turno (corregido)
  crearTurno(): void {
    const hoy = new Date();
    const [year, month, day] = this.nuevoTurno.fecha.split('-').map(Number);
    const [hour, minute] = this.nuevoTurno.hora.split(':').map(Number);
    const fechaHoraTurno = new Date(year, month - 1, day, hour, minute);

    if (fechaHoraTurno < hoy) {
      alert('⚠️ La fecha y hora del turno no pueden ser en el pasado.');
      return;
    }

    const turnoAEnviar = {
      fecha: this.nuevoTurno.fecha,
      hora: this.nuevoTurno.hora,
      razon: this.nuevoTurno.razon,
      pacienteId: this.nuevoTurno.pacienteId  // ✅ corregido acá
    };

    this.http.post<Turno>('http://localhost:3000/turnos', turnoAEnviar).subscribe({
      next: () => {
        this.cargarTurnos();
        this.nuevoTurno = { fecha: '', hora: '', razon: '', pacienteId: null };
      },
      error: (err) => console.error('Error al crear turno:', err)
    });
  }

  // Seleccionar turno para editar (optimizado y más claro)
  editarTurno(turno: Turno): void {
    this.turnoEditando = {
      ...turno,
      paciente: { ...turno.paciente }
    };
  }

  // Guardar cambios de edición (corregido)
  guardarEdicion(): void {
    if (!this.turnoEditando) return;

    const turnoActualizado = {
      fecha: this.turnoEditando.fecha,
      hora: this.turnoEditando.hora,
      razon: this.turnoEditando.razon,
      pacienteId: this.turnoEditando.paciente.id // ✅ corregido acá
    };

    this.http.patch<Turno>(`http://localhost:3000/turnos/${this.turnoEditando.id}`, turnoActualizado).subscribe({
      next: () => {
        this.cargarTurnos(); // Recargar turnos para sincronizar cambios correctamente
        this.turnoEditando = null;
        console.log('Turno actualizado exitosamente.');
      },
      error: (err) => console.error('Error al actualizar turno:', err)
    });
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.turnoEditando = null;
  }

  // Eliminar turno
  eliminarTurno(id: number): void {
    if (!confirm('¿Seguro que querés eliminar este turno?')) return;

    this.http.delete<void>(`http://localhost:3000/turnos/${id}`).subscribe({
      next: () => {
        this.turnos = this.turnos.filter(t => t.id !== id);
        console.log(`Turno con ID ${id} eliminado.`);
      },
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }
}
