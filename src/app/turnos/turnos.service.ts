// Este servicio se encarga de manejar las peticiones HTTP relacionadas con los turnos.
// Se conecta al backend en http://localhost:3000/turnos y tiene métodos para obtener, crear y eliminar turnos.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../models/turno'; // Importamos el modelo de Turno

@Injectable({
  providedIn: 'root' // Esto lo hace accesible en toda la app sin tener que importar nada extra
})
export class TurnosService {
  private apiUrl = 'http://localhost:3000/turnos'; // URL base para las peticiones al backend

  constructor(private http: HttpClient) {}

  // Obtener todos los turnos
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  // Crear un nuevo turno
  crearTurno(turno: Partial<Turno>): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // Eliminar un turno por ID
  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
