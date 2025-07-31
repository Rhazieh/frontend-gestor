// Este componente maneja todo lo relacionado a los pacientes:
// muestra los pacientes existentes, permite crearlos, editarlos y eliminarlos.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../models/paciente';
import { Turno } from '../models/turno'; // Importamos para verificar si un paciente tiene turnos

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

  // Formulario de creación
  nuevoPaciente: Partial<Paciente> = {
    nombre: '',
    email: '',
    telefono: ''
  };

  // Formulario de edición
  pacienteEditando: Paciente | null = null;

  constructor() {
    this.cargarPacientes();
  }

  // ========================
  // Traer todos los pacientes
  // ========================
  cargarPacientes(): void {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes').subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('Pacientes cargados:', data);
      },
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  // ========================
  // Crear nuevo paciente
  // ========================
  crearPaciente(): void {
    this.http.post<Paciente>('http://localhost:3000/pacientes', this.nuevoPaciente).subscribe({
      next: (pacienteCreado) => {
        this.pacientes.push(pacienteCreado);
        this.nuevoPaciente = { nombre: '', email: '', telefono: '' };
      },
      error: (err) => console.error('Error al crear paciente:', err)
    });
  }

  // ========================
  // Eliminar paciente (con verificación de turnos asignados)
  // ========================
  eliminarPaciente(id: number): void {
    // Primero vemos si tiene turnos asignados antes de borrarlo
    this.http.get<Turno[]>('http://localhost:3000/turnos').subscribe({
      next: (turnos) => {
        const tieneTurnos = turnos.some(t => t.paciente?.id === id);

        const mensaje = tieneTurnos
          ? '⚠️ Este paciente tiene turnos asignados. ¿Estás seguro de que querés eliminarlo?'
          : '¿Estás seguro de que querés eliminar este paciente?';

        if (confirm(mensaje)) {
          this.http.delete<void>(`http://localhost:3000/pacientes/${id}`).subscribe({
            next: () => {
              this.pacientes = this.pacientes.filter(p => p.id !== id);
              console.log(`Paciente con ID ${id} eliminado`);
            },
            error: (err) => console.error('Error al eliminar paciente:', err)
          });
        }
      },
      error: (err) => console.error('Error al verificar turnos del paciente:', err)
    });
  }

  // ========================
  // Seleccionar paciente para editar
  // ========================
  editarPaciente(paciente: Paciente): void {
    this.pacienteEditando = { ...paciente }; // Clonamos para no modificar directamente
  }

  // ========================
  // Confirmar edición
  // ========================
  actualizarPaciente(): void {
    if (!this.pacienteEditando) return;

    this.http.patch<Paciente>(
      `http://localhost:3000/pacientes/${this.pacienteEditando.id}`,
      this.pacienteEditando
    ).subscribe({
      next: (pacienteActualizado) => {
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) {
          this.pacientes[index] = pacienteActualizado;
        }
        this.pacienteEditando = null;
      },
      error: (err) => console.error('Error al actualizar paciente:', err)
    });
  }

  // ========================
  // Cancelar edición
  // ========================
  cancelarEdicion(): void {
    this.pacienteEditando = null;
  }
}
