// frontend-gestor/src/app/pacientes/pacientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, retryWhen, scan, throwError } from 'rxjs';
import { Paciente } from '../models/paciente';
import { API_BASE } from '../config';

// reintento simple para 503 de Render (cold start)
function retry503(max = 3, waitMs = 1200) {
  return retryWhen(errors =>
    errors.pipe(
      scan((acc, err: any) => {
        if (acc >= max || (err?.status && err.status !== 503)) throw err;
        return acc + 1;
      }, 0),
      delay(waitMs)
    )
  );
}

@Injectable({ providedIn: 'root' })
export class PacientesService {
  private apiUrl = `${API_BASE}/pacientes`; // o `${API_BASE}/patients` si migrás al alias

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl).pipe(
      retry503(),
      catchError(err => throwError(() => err))
    );
  }

  crearPaciente(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  actualizarPaciente(id: number, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.patch<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
