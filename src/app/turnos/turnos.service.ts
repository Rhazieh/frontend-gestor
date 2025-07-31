// Este servicio se encarga de conectarse con el backend y manejar las peticiones relacionadas a los turnos.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Turno } from '../models/turno';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Se inyecta automáticamente en toda la app
})
export class TurnosService {
  private apiUrl = 'http://localhost:3000/turnos'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Traer todos los turnos
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  // Crear un nuevo turno
  crearTurno(turno: {
    fecha: string;
    hora: string;
    razon: string;
    paciente: number;
  }): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // Eliminar un turno por ID (para más adelante)
  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
