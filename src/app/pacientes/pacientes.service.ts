// src/app/pacientes/pacientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { API_BASE } from '../config';

@Injectable({ providedIn: 'root' })
export class PacientesService {
  // Podés cambiar a '/patients' cuando quieras migrar al alias inglés
  private apiUrl = `${API_BASE}/pacientes`;

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  crearPaciente(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  actualizarPaciente(id: number, paciente: Partial<Paciente>): Observable<Paciente> {
    // uso PATCH como en tu backend actual
    return this.http.patch<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
