import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../models/paciente';
import { Turno } from '../models/turno';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes {
  private http = inject(HttpClient);

  pacientes: Paciente[] = [];
  nuevoPaciente: Partial<Paciente> = { nombre: '', email: '', telefono: '' };
  pacienteEditando: Paciente | null = null;

  errores: any = {};
  erroresEdicion: any = {};
  intentoEnviar = false;

  constructor() {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.http.get<Paciente[]>('https://backend-gestor-zfez.onrender.com/pacientes').subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  crearPaciente(): void {
    this.intentoEnviar = true;
    this.errores = this.validarCampos(this.nuevoPaciente);
    if (Object.keys(this.errores).length > 0) return;

    this.http.post<Paciente>('https://backend-gestor-zfez.onrender.com/pacientes', this.nuevoPaciente).subscribe({
      next: (pacienteCreado) => {
        this.pacientes.push(pacienteCreado);
        this.nuevoPaciente = { nombre: '', email: '', telefono: '' };
        this.errores = {};
        this.intentoEnviar = false;
      },
      error: (err) => console.error('Error al crear paciente:', err)
    });
  }

  eliminarPaciente(id: number): void {
    this.http.get<Turno[]>('https://backend-gestor-zfez.onrender.com/turnos').subscribe({
      next: (turnos) => {
        const tieneTurnos = turnos.some(t => t.paciente?.id === id);
        const mensaje = tieneTurnos
          ? '⚠️ Este paciente tiene turnos asignados. ¿Estás seguro de que querés eliminarlo?'
          : '¿Estás seguro de que querés eliminar este paciente?';

        if (confirm(mensaje)) {
          this.http.delete<void>(`https://backend-gestor-zfez.onrender.com/pacientes/${id}`).subscribe({
            next: () => (this.pacientes = this.pacientes.filter(p => p.id !== id)),
            error: (err) => console.error('Error al eliminar paciente:', err)
          });
        }
      },
      error: (err) => console.error('Error al verificar turnos del paciente:', err)
    });
  }

  editarPaciente(paciente: Paciente): void {
    this.pacienteEditando = { ...paciente };
    this.erroresEdicion = {};
  }

  actualizarPaciente(): void {
    if (!this.pacienteEditando) return;
    this.erroresEdicion = this.validarCampos(this.pacienteEditando);
    if (Object.keys(this.erroresEdicion).length > 0) return;

    this.http.patch<Paciente>(
      `https://backend-gestor-zfez.onrender.com/pacientes/${this.pacienteEditando.id}`,
      this.pacienteEditando
    ).subscribe({
      next: (pacienteActualizado) => {
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) this.pacientes[index] = pacienteActualizado;
        this.pacienteEditando = null;
      },
      error: (err) => console.error('Error al actualizar paciente:', err)
    });
  }

  cancelarEdicion(): void {
    this.pacienteEditando = null;
    this.erroresEdicion = {};
  }

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

  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z][\w.%+-]{2,}@[a-zA-Z][\w-]*\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 30;
  }

  private validarNombre(nombre: string): boolean {
    const partes = nombre.trim().split(/\s+/);
    if (partes.length < 2 || partes.length > 4) return false;
    for (let parte of partes) {
      if (parte.length < 3 || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/.test(parte)) return false;
    }
    return nombre.length <= 30;
  }

  private validarTelefono(telefono: string): boolean {
    const regex = /^\d{8,15}$/;
    return regex.test(telefono);
  }
}
