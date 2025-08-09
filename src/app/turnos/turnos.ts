// src/app/turnos/turnos.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TurnosService } from './turnos.service';
import { PacientesService } from '../pacientes/pacientes.service';

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
  private turnosSvc = inject(TurnosService);
  private pacientesSvc = inject(PacientesService);

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
    this.turnosSvc.getTurnos().subscribe({
      next: (data) => (this.turnos = data),
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarPacientes(): void {
    this.pacientesSvc.getPacientes().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  get turnosFiltrados(): Turno[] {
    return this.turnos.filter(t => {
      const coincideFecha =
        !this.filtroFecha ||
        (t.fecha && new Date(t.fecha).toISOString().split('T')[0] === new Date(this.filtroFecha).toISOString().split('T')[0]);

      const coincidePaciente =
        !this.filtroPacienteId || t.paciente?.id === this.filtroPacienteId;

      return coincideFecha && coincidePaciente;
    });
  }

  crearTurno(): void {
    this.intentoEnviar = true;
    this.errores = {};

    if (!this.validarNuevoTurno()) return;

    const turnoAEnviar = { ...this.nuevoTurno };

    this.turnosSvc.crearTurno(turnoAEnviar).subscribe({
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

    if (!fecha) {
      this.errores.fecha = 'La fecha es obligatoria';
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
    this.turnoEditando = { ...turno, paciente: { ...turno.paciente } };
    this.erroresEdicion = {};
  }

  guardarEdicion(): void {
    if (!this.turnoEditando) return;

    this.erroresEdicion = {};
    const { fecha, hora, razon, paciente } = this.turnoEditando;

    if (!hora) this.erroresEdicion.hora = 'La hora es obligatoria';
    if (!razon?.trim()) this.erroresEdicion.razon = 'La razón es obligatoria';
    if (Object.keys(this.erroresEdicion).length > 0) return;

    const turnoActualizado = {
      fecha,
      hora,
      razon,
      pacienteId: paciente?.id
    };

    // Compatibilidad con backend actual (PATCH). Si preferís PUT, usá actualizarTurnoCompleto
    this.turnosSvc.actualizarTurnoParcial(this.turnoEditando.id, turnoActualizado).subscribe({
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

    this.turnosSvc.eliminarTurno(id).subscribe({
      next: () => (this.turnos = this.turnos.filter(t => t.id !== id)),
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }

  getFechaFormateada(fecha: string): string {
    if (!fecha) return '—';
    const fechaObj = new Date(fecha);
    // normalizo a local sin offset
    fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset());
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}
