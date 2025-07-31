import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente'; // ✅ Usamos el modelo centralizado

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  private apiUrl = 'http://localhost:3000/pacientes';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }
}
