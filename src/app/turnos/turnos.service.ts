// frontend-gestor/src/app/turnos/turnos.service.ts
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
import { Turno } from '../models/turno';
import { API_BASE } from '../config';

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
export class TurnosService {
  private apiUrl = `${API_BASE}/turnos`; // o `${API_BASE}/appointments`

  constructor(private http: HttpClient) {}

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl).pipe(
      retry503<Turno[]>(),
      catchError((err) => throwError(() => err)),
    );
  }

  crearTurno(turno: Partial<Turno>): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  actualizarTurnoParcial(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  actualizarTurnoCompleto(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
