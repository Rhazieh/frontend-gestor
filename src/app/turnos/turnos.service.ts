// src/app/turnos/turnos.service.ts
// Servicio de Turnos centralizado: sin URLs hardcodeadas en componentes.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../models/turno';
import { API_BASE } from '../config';

@Injectable({ providedIn: 'root' })
export class TurnosService {
  // Podés cambiar a '/appointments' cuando quieras usar alias inglés
  private apiUrl = `${API_BASE}/turnos`;

  constructor(private http: HttpClient) {}

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  crearTurno(turno: Partial<Turno>): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // PATCH parcial (compatibilidad con tu backend actual)
  actualizarTurnoParcial(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  // PUT completo (si preferís cumplir literalmente el enunciado)
  actualizarTurnoCompleto(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
