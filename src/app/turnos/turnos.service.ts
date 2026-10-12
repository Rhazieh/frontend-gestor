// frontend-gestor/src/app/turnos/turnos.service.ts
// -----------------------------------------------------------------------------
// Servicio Angular para hablar con el backend sobre TURNOS.
// Acá centralizamos TODAS las llamadas HTTP relacionadas a turnos:
//   - listar, crear, actualizar (PUT/PATCH) y eliminar.
// Usa HttpClient y la constante API_BASE para apuntar al backend correcto
// (localhost en desarrollo o Render en producción).
//
// Extra: incluye un helper `retry503` para reintentar automáticamente cuando
// Render despierta el servicio y responde 503 (Service Unavailable).
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
import { Turno } from '../models/turno';
import { API_BASE } from '../config';

// -----------------------------------------------------------------------------
// retry503: operador RxJS para reintentar si el backend responde 503
//
// ¿Por qué existe esto?
// - En Render, si la app estuvo “dormida”, la primera request puede devolver 503.
// - Este helper vuelve a intentar hasta `max` veces, esperando `waitMs` entre intentos.
// - Si el error NO es 503, no reintenta (lo relanza tal cual).
//
// Uso: this.http.get(...).pipe(retry503<Tipo>())
// -----------------------------------------------------------------------------
function retry503<T>(max = 3, waitMs = 1200): MonoTypeOperatorFunction<T> {
  return retryWhen((errors) =>
    errors.pipe(
      // `scan` acumula la cantidad de intentos realizados
      scan((acc: number, err: any) => {
        // Si ya superamos el máximo, o el error no es 503 -> dejamos de reintentar
        if (acc >= max || (err?.status && err.status !== 503)) throw err;
        return acc + 1; // sumamos un intento y seguimos
      }, 0),
      delay(waitMs), // esperamos un ratito antes del próximo intento
    ),
  );
}

@Injectable({ providedIn: 'root' })
export class TurnosService {
  // Base de la API para Turnos. Podrías cambiar a `${API_BASE}/appointments` por el alias inglés.
  private apiUrl = `${API_BASE}/turnos`; // o `${API_BASE}/appointments`

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------------------------
  // GET /turnos  -> Trae la lista completa de turnos
  // - Aplica retry503 por si el backend está “frío”.
  // - catchError: reenvía el error para que el componente lo maneje (console, UI, etc.)
  // ---------------------------------------------------------------------------
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl).pipe(
      retry503<Turno[]>(),
      catchError((err) => throwError(() => err)),
    );
  }

  // ---------------------------------------------------------------------------
  // POST /turnos -> Crea un turno nuevo
  // Espera un objeto con { fecha, hora, razon, pacienteId } (ver backend DTO).
  // ---------------------------------------------------------------------------
  crearTurno(turno: Partial<Turno>): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // ---------------------------------------------------------------------------
  // PATCH /turnos/:id -> Actualiza parcialmente un turno
  // Útil para cambiar solo uno o dos campos (por ejemplo, la hora o la razón).
  // ---------------------------------------------------------------------------
  actualizarTurnoParcial(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  // ---------------------------------------------------------------------------
  // PUT /turnos/:id -> Actualización “completa” (semánticamente)
  // En nuestro backend acepta parciales también, pero mantenemos ambos métodos
  // para cumplir con el enunciado y por claridad en el front.
  // ---------------------------------------------------------------------------
  actualizarTurnoCompleto(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  // ---------------------------------------------------------------------------
  // DELETE /turnos/:id -> Elimina un turno por ID
  // ---------------------------------------------------------------------------
  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// ----------------------------------------------------------------------------