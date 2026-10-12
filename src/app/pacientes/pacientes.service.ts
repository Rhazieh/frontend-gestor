// frontend-gestor/src/app/pacientes/pacientes.service.ts
// -----------------------------------------------------------------------------
// ¿Qué es esto?
// Servicio Angular para hablar con el backend sobre "pacientes".
// Centraliza HTTP (GET/POST/PUT/DELETE) y deja al componente sólo la parte de UI.
//
// Puntos clave:
// - Usa API_BASE (config.ts) para cambiar solo/auto entre localhost y Render.
// - Implementa un "retry" suave ante errores 503 (Render puede “despertar”).
// - Devuelve Observables tipados (Paciente[], Paciente, void, etc.).
// -----------------------------------------------------------------------------

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  delay,
  retryWhen,
  scan,
  throwError,
  MonoTypeOperatorFunction,
} from 'rxjs';
import { Paciente } from '../models/paciente';
import { Turno } from '../models/turno';
import { API_BASE } from '../config';

// Reintento tipado para evitar TS2345
// -----------------------------------------------------------------------------
// retry503:
// - Reintenta hasta "max" veces si el error es 503 (Service Unavailable).
// - Entre intentos espera "waitMs" milisegundos.
// - Si el error NO es 503 o ya agotó intentos, relanza el error.
// Esto ayuda con servicios en Render que se “duermen” y responden 503 al inicio.
function retry503<T>(max = 3, waitMs = 1200): MonoTypeOperatorFunction<T> {
  return retryWhen((errors) =>
    errors.pipe(
      scan((acc: number, err: any) => {
        if (acc >= max || (err?.status && err.status !== 503)) throw err;
        return acc + 1;
      }, 0),
      delay(waitMs),
    ),
  );
}

@Injectable({ providedIn: 'root' })
// providedIn: 'root' => Angular lo provee globalmente, sin necesidad de declararlo en un módulo.
export class PacientesService {
  // Endpoints:
  // - Español actual del backend:   /pacientes
  // - Alias en inglés disponible:   /patients
  // Si quisieras cambiar al alias en inglés, bastaría con modificar esta línea.
  private apiUrl = `${API_BASE}/pacientes`; // o `${API_BASE}/patients`

  constructor(private http: HttpClient) {}

  // GET /pacientes -> Lista de pacientes (con turnos incluidos según backend)
  // Agregamos retry503 para tolerar un 503 inicial y catchError para propagar el error.
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl).pipe(
      retry503<Paciente[]>(),
      catchError((err) => throwError(() => err)),
    );
  }

  // POST /pacientes -> Crea un paciente
  // Recibe un objeto parcial (nombre, email, teléfono). El backend valida con DTOs.
  crearPaciente(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  // PUT /pacientes/:id -> Actualiza un paciente completo/parcial (nuestro backend acepta PUT)
  // Si prefirieras PATCH, podríamos tener otro método similar usando this.http.patch.
  actualizarPaciente(id: number, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  // DELETE /pacientes/:id -> Borra un paciente (en el backend, los turnos se van en cascada)
  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET /patients/:id/appointments -> Turnos por paciente (para confirmar borrado o listar)
  // Nota: aquí usamos el alias en inglés a propósito porque existe en tu backend.
  getAppointmentsByPatient(id: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${API_BASE}/patients/${id}/appointments`);
  }
}