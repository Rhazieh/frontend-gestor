// Este servicio se encarga de comunicarse con el backend para todo lo relacionado a pacientes.
// Acá hacemos las peticiones HTTP (GET, POST, PUT, DELETE) usando el HttpClient.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' }) // El servicio está disponible globalmente sin necesidad de importarlo en un módulo.
export class PacientesService {
  // Señal reactiva que guarda el listado de pacientes. Se actualiza automáticamente cuando cambia.
  pacientes = signal<any[]>([]);

  // URL base del backend (ajustala si cambia en producción)
  private baseUrl = 'http://localhost:3000/pacientes';

  constructor(private http: HttpClient) {}

  // Trae todos los pacientes del backend y actualiza el signal.
  obtenerPacientes() {
    this.http.get<any[]>(this.baseUrl).subscribe((data) => {
      this.pacientes.set(data);
    });
  }

  // Más adelante vamos a agregar los métodos para crear, actualizar y eliminar pacientes.
}
