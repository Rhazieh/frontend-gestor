// turnos.ts actualizado con validaciones y formatos correctos en edición

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
      next: (data) => {
        this.turnos = data;
      },
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  get turnosFiltrados(): Turno[] {
    if (!this.filtroFecha) return this.turnos;
    return this.turnos.filter(t => {
      const turnoFecha = new Date(t.fecha).toISOString().split('T')[0];
      const filtro = new Date(this.filtroFecha).toISOString().split('T')[0];
      return turnoFecha === filtro;
    });
  }

  crearTurno(): void {
    const hoy = new Date();

    if (!this.nuevoTurno.fecha || !this.nuevoTurno.hora || !this.nuevoTurno.razon || !this.nuevoTurno.pacienteId) {
      alert('⚠️ Completá todos los campos.');
      return;
    }

    const fechaHora = new Date(`${this.nuevoTurno.fecha}T${this.nuevoTurno.hora}`);
    const año = fechaHora.getFullYear();
    if (fechaHora < hoy || año > 2050) {
      alert('⚠️ Fecha no válida.');
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
    if (!this.turnoEditando || !this.turnoEditando.hora || !this.turnoEditando.razon) {
      alert('⚠️ Completá todos los campos.');
      return;
    }

    const [anio, mes, dia] = this.turnoEditando.fecha.split('-').map(Number);
    const [hora, minuto] = this.turnoEditando.hora.split(':').map(Number);
    const fechaHora = new Date(anio, mes - 1, dia, hora, minuto);

    const hoy = new Date();
    const año = fechaHora.getFullYear();
    if (fechaHora < hoy || año > 2050) {
      alert('⚠️ Fecha y hora no válidas. No podés poner un turno en el pasado ni en un año absurdo.');
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
      next: () => {
        this.turnos = this.turnos.filter(t => t.id !== id);
      },
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }

  getFechaFormateada(fecha: string): string {
    const fechaObj = new Date(fecha);
    fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset());
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}
