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

  constructor() {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  crearPaciente(): void {
    console.log('Nuevo paciente:', this.nuevoPaciente);
    if (!this.validarCampos(this.nuevoPaciente)) return;

    this.http.post<Paciente>('http://localhost:3000/pacientes', this.nuevoPaciente).subscribe({
      next: (pacienteCreado) => {
        this.pacientes.push(pacienteCreado);
        this.nuevoPaciente = { nombre: '', email: '', telefono: '' };
      },
      error: (err) => console.error('Error al crear paciente:', err)
    });
  }

  eliminarPaciente(id: number): void {
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (turnos) => {
        const tieneTurnos = turnos.some(t => t.paciente?.id === id);
        const mensaje = tieneTurnos
          ? '⚠️ Este paciente tiene turnos asignados. ¿Estás seguro de que querés eliminarlo?'
          : '¿Estás seguro de que querés eliminar este paciente?';

        if (confirm(mensaje)) {
          this.http.delete<void>(`http://localhost:3000/pacientes/${id}`).subscribe({
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
  }

  actualizarPaciente(): void {
    if (!this.pacienteEditando) return;
    if (!this.validarCampos(this.pacienteEditando)) return;

    this.http.patch<Paciente>(
      `http://localhost:3000/pacientes/${this.pacienteEditando.id}`,
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
  }

  private validarCampos(paciente: Partial<Paciente>): boolean {
    if (!paciente.nombre?.trim() || !paciente.email?.trim() || !paciente.telefono?.trim()) {
      alert('⚠️ Todos los campos son obligatorios.');
      return false;
    }

    if (!this.validarNombre(paciente.nombre)) {
      alert('⚠️ El nombre debe tener entre 2 y 4 palabras, mínimo 3 letras cada una.');
      return false;
    }

    if (!this.validarEmail(paciente.email)) {
      alert('⚠️ Ingresá un email válido con letras en nombre y dominio.');
      return false;
    }

    if (!this.validarTelefono(paciente.telefono)) {
      alert('⚠️ El teléfono debe tener entre 8 y 15 dígitos numéricos.');
      return false;
    }

    return true;
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
