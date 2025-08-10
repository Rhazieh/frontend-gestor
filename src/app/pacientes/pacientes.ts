
// src/app/pacientes/pacientes.ts
// -----------------------------------------------------------------------------
// ¿Qué es esto?
// Componente standalone de Angular que muestra y gestiona la lista de pacientes.
// Se encarga de:
//  - Listar pacientes (GET).
//  - Crear pacientes (POST) con validaciones simples en la UI.
//  - Editar pacientes (PUT) con validaciones.
//  - Eliminar pacientes (DELETE) con confirmación (y chequeo de turnos previos).
//
// Cómo se conecta todo:
//  - Usa PacientesService para hablar con el backend (/pacientes o /patients).
//  - Usa TurnosService solo de forma indirecta a través de PacientesService
//    (getAppointmentsByPatient) para confirmar borrado si hay turnos.
//  - Plantilla HTML: ./pacientes.html (render de tablas y formularios).
//  - Estilos:       ./pacientes.css
//
// Nota: es "standalone: true", o sea NO depende de un NgModule. Importa
// CommonModule y FormsModule localmente para *ngFor, [(ngModel)], etc.
// -----------------------------------------------------------------------------

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PacientesService } from './pacientes.service';
import { TurnosService } from '../turnos/turnos.service';

import { Paciente } from '../models/paciente';
import { Turno } from '../models/turno';

@Component({
  selector: 'app-pacientes',        // etiqueta que usaría Angular si fuera anidado
  standalone: true,                 // componente independiente (sin NgModule)
  imports: [CommonModule, FormsModule], // habilita directivas y formularios template-driven
  templateUrl: './pacientes.html',  // vista asociada
  styleUrl: './pacientes.css'       // estilos del componente
})
export class Pacientes {
  // Inyección "con inject()" (API moderna de Angular) en lugar de constructor
  private pacientesSvc = inject(PacientesService);
  private turnosSvc = inject(TurnosService); // (lo usamos vía pacientesSvc.getAppointmentsByPatient)

  // Estado en memoria que usa el HTML para renderizar
  pacientes: Paciente[] = [];
  // Modelo del formulario "Crear"
  nuevoPaciente: Partial<Paciente> = { nombre: '', email: '', telefono: '' };
  // Si es null => no estamos editando; si tiene algo => formulario de edición visible
  pacienteEditando: Paciente | null = null;

  // Estructuras simples para mostrar mensajes de error debajo de inputs
  errores: any = {};
  erroresEdicion: any = {};
  intentoEnviar = false; // marca que el usuario intentó enviar el form "Crear"

  constructor() {
    // Al montar el componente, traigo la lista
    this.cargarPacientes();
  }

  // GET /pacientes -> trae y guarda en this.pacientes
  cargarPacientes(): void {
    this.pacientesSvc.getPacientes().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  // Clic en "Crear" -> valida en la UI y POST al backend
  crearPaciente(): void {
    this.intentoEnviar = true;
    this.errores = this.validarCampos(this.nuevoPaciente);
    if (Object.keys(this.errores).length > 0) return; // si hay errores, no envío

    this.pacientesSvc.crearPaciente(this.nuevoPaciente).subscribe({
      next: (pacienteCreado) => {
        // Actualizo la tabla en memoria sin recargar todo
        this.pacientes.push(pacienteCreado);
        // Reseteo el form
        this.nuevoPaciente = { nombre: '', email: '', telefono: '' };
        this.errores = {};
        this.intentoEnviar = false;
      },
      error: (err) => console.error('Error al crear paciente:', err)
    });
  }

  // DELETE con confirmación: primero consulto turnos del paciente para avisar si tiene
  eliminarPaciente(id: number): void {
    // Confirmo con turnos del paciente (endpoint dedicado)
    this.pacientesSvc.getAppointmentsByPatient(id).subscribe({
      next: (turnos: Turno[]) => {
        const tieneTurnos = (turnos?.length ?? 0) > 0;
        const mensaje = tieneTurnos
          ? '⚠ Este paciente tiene turnos asignados. ¿Estás seguro de que querés eliminarlo?'
          : '¿Estás seguro de que querés eliminar este paciente?';

        if (confirm(mensaje)) {
          this.pacientesSvc.eliminarPaciente(id).subscribe({
            next: () => (this.pacientes = this.pacientes.filter(p => p.id !== id)),
            error: (err) => console.error('Error al eliminar paciente:', err)
          });
        }
      },
      error: (err) => console.error('Error al verificar turnos del paciente:', err)
    });
  }

  // Pone el formulario de edición visible y con una copia de los datos
  editarPaciente(paciente: Paciente): void {
    this.pacienteEditando = { ...paciente }; // copia defensiva
    this.erroresEdicion = {};                 // limpio errores previos
  }

  // PUT al backend con el contenido del formulario de edición
  actualizarPaciente(): void {
    if (!this.pacienteEditando) return;
    // Valido en UI (mismas reglas que crear)
    this.erroresEdicion = this.validarCampos(this.pacienteEditando);
    if (Object.keys(this.erroresEdicion).length > 0) return;

    this.pacientesSvc.actualizarPaciente(this.pacienteEditando.id, this.pacienteEditando).subscribe({
      next: (pacienteActualizado) => {
        // Reflejo el cambio en el array original sin recargar todo
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) this.pacientes[index] = pacienteActualizado;
        // Cierro el modo edición
        this.pacienteEditando = null;
      },
      error: (err) => console.error('Error al actualizar paciente:', err)
    });
  }

  // Cancela edición (oculta el formulario)
  cancelarEdicion(): void {
    this.pacienteEditando = null;
    this.erroresEdicion = {};
  }

  // --- Validaciones simples de UI ---
  // Devuelve un objeto { campo: 'mensaje' } con los errores detectados
  private validarCampos(paciente: Partial<Paciente>): any {
    const errores: any = {};

    if (!paciente.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio.';
    } else if (!this.validarNombre(paciente.nombre)) {
      errores.nombre = 'Debe tener de 2 a 4 palabras, mínimo 3 letras cada una.';
    }

    if (!paciente.email?.trim()) {
      errores.email = 'El email es obligatorio.';
    } else if (!this.validarEmail(paciente.email)) {
      errores.email = 'Formato de email inválido.';
    }

    if (!paciente.telefono?.trim()) {
      errores.telefono = 'El teléfono es obligatorio.';
    } else if (!this.validarTelefono(paciente.telefono)) {
      errores.telefono = 'Debe tener entre 8 y 15 dígitos.';
    }

    return errores;
  }

  // Reglas básicas: algo-@-algo-.dominio y longitud máxima 30
  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z][\w.%+-]{2,}@[a-zA-Z][\w-]*\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 30;
  }

  // Entre 2 y 4 palabras, cada una con al menos 3 letras (incluye acentos y ñ)
  private validarNombre(nombre: string): boolean {
    const partes = nombre.trim().split(/\s+/);
    if (partes.length < 2 || partes.length > 4) return false;
    for (let parte of partes) {
      if (parte.length < 3 || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/.test(parte)) return false;
    }
    return nombre.length <= 30;
  }

  // Sólo dígitos, entre 8 y 15
  private validarTelefono(telefono: string): boolean {
    const regex = /^\d{8,15}$/;
    return regex.test(telefono);
  }
}

// — Siguiente archivo recomendado: src/app/pacientes/pacientes.html