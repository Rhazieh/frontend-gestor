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
      next: (data) => {
        // normalizo hora a "HH:MM" (si viniera "HH:MM:SS" del backend)
        this.turnos = data.map(t => ({
          ...t,
          hora: t?.hora ? t.hora.slice(0, 5) : ''
        }));
      },
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
      // comparo por string YYYY-MM-DD para evitar timezone raros
      const coincideFecha =
        !this.filtroFecha ||
        (!!t.fecha && t.fecha.slice(0, 10) === this.filtroFecha);

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
    const errores: any = {};

    if (!fecha) { errores.fecha = 'La fecha es obligatoria'; valido = false; }
    if (!hora)  { errores.hora  = 'La hora es obligatoria';  valido = false; }
    if (!razon?.trim()) { errores.razon = 'La razón es obligatoria'; valido = false; }
    if (!pacienteId) { errores.pacienteId = 'Debés seleccionar un paciente'; valido = false; }

    // Validación fuerte: fecha+hora en local >= ahora
    if (fecha && hora) {
      const [y, m, d] = fecha.split('-').map(Number);
      const [hh, mm]  = hora.split(':').map(Number);
      const cuando = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
      const ahora = new Date(); ahora.setSeconds(0, 0);
      if (isNaN(cuando.getTime()) || cuando < ahora || (y ?? 0) > 2050) {
        errores.fecha = 'La fecha y hora deben ser presentes o futuras';
        valido = false;
      }
    }

    this.errores = errores;
    return valido;
  }

  editarTurno(turno: Turno): void {
    // normalizo la hora para el <input type="time">
    this.turnoEditando = {
      ...turno,
      hora: turno?.hora ? turno.hora.slice(0, 5) : '',
      paciente: { ...turno.paciente }
    };
    this.erroresEdicion = {};
  }

  guardarEdicion(): void {
    if (!this.turnoEditando) return;

    this.erroresEdicion = {};
    const { fecha, hora, razon, paciente } = this.turnoEditando;
    let valido = true;

    if (!hora) { this.erroresEdicion.hora = 'La hora es obligatoria'; valido = false; }
    if (!razon?.trim()) { this.erroresEdicion.razon = 'La razón es obligatoria'; valido = false; }

    // Chequeo fecha+hora en local
    const [y, m, d] = (fecha ?? '').split('-').map(Number);
    const [hh, mm]  = (hora ?? '').split(':').map(Number);
    const cuando = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
    const ahora = new Date(); ahora.setSeconds(0, 0);
    if (isNaN(cuando.getTime()) || cuando < ahora || (y ?? 0) > 2050) {
      this.erroresEdicion.fecha = 'Fecha inválida';
      valido = false;
    }

    if (!valido) return;

    const turnoActualizado = {
      fecha,
      hora, // ya viene "HH:MM"
      razon,
      pacienteId: paciente?.id
    };

    // Compatibilidad con backend actual (PATCH)
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
    // Evito timezone: parseo el string "YYYY-MM-DD" directo
    const soloFecha = fecha.split('T')[0] ?? fecha;
    const [y, m, d] = soloFecha.split('-').map(Number);
    if (!y || !m || !d) return soloFecha;
    const dd = d.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    const yyyy = y.toString();
    return `${dd}/${mm}/${yyyy}`;
  }
}
