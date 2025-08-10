// frontend-gestor/src/app/turnos/turnos.ts
// -----------------------------------------------------------------------------
// Componente Angular que maneja la pantalla de TURNOS (listar, filtrar, crear,
// editar y eliminar). Es un componente standalone (no usa NgModule) y se apoya
// en dos servicios:
//   - TurnosService: llamadas HTTP a /turnos (backend).
//   - PacientesService: para poblar el <select> de pacientes.
// También contiene validaciones básicas en el cliente (fecha/hora, razón, etc.).
// Su HTML asociado está en: ./turnos.html
// -----------------------------------------------------------------------------

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TurnosService } from './turnos.service';
import { PacientesService } from '../pacientes/pacientes.service';

import { Turno } from '../models/turno';
import { Paciente } from '../models/paciente';

@Component({
  selector: 'app-turnos',            // etiqueta usada por el router para renderizar
  standalone: true,                  // componente independiente (Angular moderno)
  imports: [CommonModule, FormsModule], // necesito *ngFor, *ngIf y [(ngModel)]
  templateUrl: './turnos.html',      // template con la UI
  styleUrl: './turnos.css'           // estilos específicos de este componente
})
export class Turnos {
  // Inyección con API "inject": más simple que constructor(private svc: Svc) {}
  private turnosSvc = inject(TurnosService);
  private pacientesSvc = inject(PacientesService);

  // Estado de la vista
  turnos: Turno[] = [];              // lista completa traída del backend
  pacientes: Paciente[] = [];        // lista para el combo <select>

  // Filtros de la grilla
  filtroFecha: string = '';          // 'YYYY-MM-DD'
  filtroPacienteId: number | null = null;

  // Modelo del formulario "crear turno"
  nuevoTurno = {
    fecha: '',
    hora: '',
    razon: '',
    pacienteId: null as number | null
  };

  // Edición inline (si hay un turno seleccionado para editar)
  turnoEditando: Turno | null = null;

  // Errores de validación para crear/editar
  errores: any = {};
  erroresEdicion: any = {};
  intentoEnviar = false;             // marca si intenté enviar para mostrar errores

  constructor() {
    // Al montar el componente, cargo datos iniciales
    this.cargarTurnos();
    this.cargarPacientes();
  }

  // ---------------------------------------------------------------------------
  // Trae turnos del backend y normaliza la hora a "HH:MM"
  // (por si el backend devuelve "HH:MM:SS").
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Carga la lista de pacientes para el <select> del formulario.
  // ---------------------------------------------------------------------------
  cargarPacientes(): void {
    this.pacientesSvc.getPacientes().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  // ---------------------------------------------------------------------------
  // Getter computado: aplica filtros en memoria sobre `turnos`.
  // - Fecha: comparo strings 'YYYY-MM-DD' para evitar líos de timezone.
  // - Paciente: compara por id.
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Crea un turno nuevo:
  // - Marca intentoEnviar para mostrar mensajes si falta algo.
  // - Valida campos mínimos y coherencia de fecha/hora.
  // - Llama al servicio y resetea el formulario si sale bien.
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Validación de alta (cliente):
  // - Requeridos: fecha, hora, razón, pacienteId.
  // - Coherencia: fecha/hora deben ser presentes o futuras y año <= 2050.
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Pasa el turno a modo edición: clona datos y normaliza hora a "HH:MM"
  // para que el <input type="time"> lo acepte.
  // ---------------------------------------------------------------------------
  editarTurno(turno: Turno): void {
    // normalizo la hora para el <input type="time">
    this.turnoEditando = {
      ...turno,
      hora: turno?.hora ? turno.hora.slice(0, 5) : '',
      paciente: { ...turno.paciente }
    };
    this.erroresEdicion = {};
  }

  // ---------------------------------------------------------------------------
  // Guarda los cambios de la edición:
  // - Valida hora/razón y coherencia de fecha.
  // - Arma el payload con pacienteId para el backend.
  // - Llama PATCH (podría ser PUT) y refresca la lista.
  // ---------------------------------------------------------------------------
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

  // Cancela la edición y oculta el formulario
  cancelarEdicion(): void {
    this.turnoEditando = null;
  }

  // ---------------------------------------------------------------------------
  // Elimina un turno por ID con confirmación previa.
  // ---------------------------------------------------------------------------
  eliminarTurno(id: number): void {
    if (!confirm('¿Seguro que querés eliminar este turno?')) return;

    this.turnosSvc.eliminarTurno(id).subscribe({
      next: () => (this.turnos = this.turnos.filter(t => t.id !== id)),
      error: (err) => console.error('Error al eliminar turno:', err)
    });
  }

  // ---------------------------------------------------------------------------
  // Formatea la fecha recibida (string) a "DD/MM/YYYY", evitando problemas de TZ.
  // ---------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
//   1) "src/app/turnos/turnos.html"  (template del componente)
//   2) Luego "src/app/pacientes/pacientes.service.ts" y "src/app/pacientes/pacientes.ts"
// -----------------------------------------------------------------------------