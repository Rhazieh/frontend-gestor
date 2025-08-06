// turnos.ts mejorado con validaciones en pantalla

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
  filtroPacienteId: number | null = null;

  nuevoTurno = {
    fecha: '',
    hora: '',
    razon: '',
    pacienteId: null as number | null
  };

  turnoEditando: Turno | null = null;

  errores: any = {};
  erroresEdicion: any = {};
  intentoEnviar = false;

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
    return this.turnos.filter(t => {
      const coincideFecha = !this.filtroFecha || new Date(t.fecha).toISOString().split('T')[0] === new Date(this.filtroFecha).toISOString().split('T')[0];
      const coincidePaciente = !this.filtroPacienteId || t.paciente?.id === this.filtroPacienteId;
      return coincideFecha && coincidePaciente;
    });
  }

  crearTurno(): void {
    this.intentoEnviar = true;
    this.errores = {};

    if (!this.validarNuevoTurno()) return;

    const turnoAEnviar = { ...this.nuevoTurno };

    this.http.post<Turno>('http://localhost:3000/turnos', turnoAEnviar).subscribe({
      next: () => {
        this.cargarTurnos();
        this.nuevoTurno = { fecha: '', hora: '', razon: '', pacienteId: null };
        this.intentoEnviar = false;
      },
      error: (err) => console.error('Error al crear turno:', err)
    });
  }

  validarNuevoTurno(): boolean {
    const { fecha, hora, razon, pacienteId } = this.nuevoTurno;
    let valido = true;
    const hoy = new Date();
    const fechaHora = new Date(`${fecha}T${hora}`);
    const año = fechaHora.getFullYear();

    if (!fecha) {
      this.errores.fecha = 'La fecha es obligatoria';
      valido = false;
    } else if (fechaHora < hoy || año > 2050) {
      this.errores.fecha = 'La fecha debe ser posterior a hoy y no superar el año 2050';
      valido = false;
    }

    if (!hora) {
      this.errores.hora = 'La hora es obligatoria';
      valido = false;
    }

    if (!razon?.trim()) {
      this.errores.razon = 'La razón es obligatoria';
      valido = false;
    }

    if (!pacienteId) {
      this.errores.pacienteId = 'Debés seleccionar un paciente';
      valido = false;
    }

    return valido;
  }

  editarTurno(turno: Turno): void {
    this.turnoEditando = {
      ...turno,
      paciente: { ...turno.paciente }
    };
    this.erroresEdicion = {};
  }

  guardarEdicion(): void {
    this.erroresEdicion = {};

    if (!this.validarTurnoEditando()) return;

    const turnoActualizado = {
      fecha: this.turnoEditando!.fecha,
      hora: this.turnoEditando!.hora,
      razon: this.turnoEditando!.razon,
      pacienteId: this.turnoEditando!.paciente.id
    };

    this.http.patch<Turno>(`http://localhost:3000/turnos/${this.turnoEditando!.id}`, turnoActualizado).subscribe({
      next: () => {
        this.cargarTurnos();
        this.turnoEditando = null;
      },
      error: (err) => console.error('Error al actualizar turno:', err)
    });
  }

  validarTurnoEditando(): boolean {
    if (!this.turnoEditando) return false;

    const { fecha, hora, razon } = this.turnoEditando;
    let valido = true;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const [h, m] = hora.split(':').map(Number);
    const fechaHora = new Date(anio, mes - 1, dia, h, m);
    const hoy = new Date();

    if (!hora) {
      this.erroresEdicion.hora = 'La hora es obligatoria';
      valido = false;
    }

    if (!razon?.trim()) {
      this.erroresEdicion.razon = 'La razón es obligatoria';
      valido = false;
    }

    if (fechaHora < hoy || anio > 2050) {
      this.erroresEdicion.fecha = 'Fecha inválida';
      valido = false;
    }

    return valido;
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
