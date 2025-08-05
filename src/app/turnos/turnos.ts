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

  cargarTurnos(): void {
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (data) => this.turnos = data,
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  get turnosFiltrados(): Turno[] {
    if (!this.filtroFecha) return this.turnos;
    return this.turnos.filter(t => t.fecha === this.filtroFecha);
  }

  crearTurno(): void {
    const hoy = new Date();
    const fechaHora = new Date(`${this.nuevoTurno.fecha}T${this.nuevoTurno.hora}`);

    if (fechaHora < hoy) {
      alert('⚠️ La fecha y hora del turno no pueden ser en el pasado.');
      return;
    }

    const turnoAEnviar = {
      fecha: this.nuevoTurno.fecha,
      hora: this.nuevoTurno.hora,
      razon: this.nuevoTurno.razon,
      pacienteId: this.nuevoTurno.pacienteId
    };

    this.http.post<Turno>('http://localhost:3000/turnos', turnoAEnviar).subscribe({
      next: () => {
        this.cargarTurnos();
        this.nuevoTurno = { fecha: '', hora: '', razon: '', pacienteId: null };
      },
      error: (err) => console.error('Error al crear turno:', err)
    });
  }

  editarTurno(turno: Turno): void {
    this.turnoEditando = {
      ...turno,
      paciente: { ...turno.paciente }
    };
  }

  guardarEdicion(): void {
    if (!this.turnoEditando) return;

    const hoy = new Date();
    const fechaHora = new Date(`${this.turnoEditando.fecha}T${this.turnoEditando.hora}`);

    if (fechaHora < hoy) {
      alert('⚠️ La fecha y hora del turno no pueden ser en el pasado.');
      return;
    }

    const turnoActualizado = {
      fecha: this.turnoEditando.fecha,
      hora: this.turnoEditando.hora,
      razon: this.turnoEditando.razon,
      pacienteId: this.turnoEditando.paciente.id
    };

    this.http.patch<Turno>(`http://localhost:3000/turnos/${this.turnoEditando.id}`, turnoActualizado).subscribe({
      next: () => {
        this.cargarTurnos();
        this.turnoEditando = null;
      },
      error: (err) => console.error('Error al actualizar turno:', err)
    });
  }

  cancelarEdicion(): void {
    this.turnoEditando = null;
  }

  eliminarTurno(id: number): void {
    if (!confirm('¿Seguro que querés eliminar este turno?')) return;

    this.http.delete<void>(`http://localhost:3000/turnos/${id}`).subscribe({
      next: () => this.turnos = this.turnos.filter(t => t.id !== id),
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }

  getFechaFormateada(fecha: string): string {
    const [year, month, day] = fecha.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }
}
