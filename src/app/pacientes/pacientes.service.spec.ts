import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PacientesService } from './pacientes.service';
import { API_BASE } from '../config';

describe('PacientesService', () => {
  let service: PacientesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PacientesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe listar pacientes con GET /pacientes', () => {
    const mockPacientes = [
      { id: 1, nombre: 'Ana', email: 'ana@test.com', telefono: '123456' },
    ];

    service.getPacientes().subscribe((data) => {
      expect(data).toEqual(mockPacientes);
    });

    const req = httpMock.expectOne(`${API_BASE}/pacientes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPacientes);
  });

  it('debe propagar error HTTP distinto de 503 en getPacientes', () => {
    let statusError = 0;

    service.getPacientes().subscribe({
      error: (err) => {
        statusError = err.status;
      },
    });

    const req = httpMock.expectOne(`${API_BASE}/pacientes`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    expect(statusError).toBe(500);
  });

  it('debe crear un paciente con POST /pacientes', () => {
    const nuevo = { nombre: 'Luis', email: 'luis@test.com', telefono: '999' };
    const creado = { id: 2, ...nuevo };

    service.crearPaciente(nuevo).subscribe((data) => {
      expect(data).toEqual(creado);
    });

    const req = httpMock.expectOne(`${API_BASE}/pacientes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevo);
    req.flush(creado);
  });

  it('debe actualizar un paciente con PUT /pacientes/:id', () => {
    const cambios = { nombre: 'Luis Editado' };

    service.actualizarPaciente(2, cambios).subscribe((data) => {
      expect(data.nombre).toBe('Luis Editado');
    });

    const req = httpMock.expectOne(`${API_BASE}/pacientes/2`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 2, nombre: 'Luis Editado', email: 'luis@test.com', telefono: '999' });
  });

  it('debe eliminar un paciente con DELETE /pacientes/:id', () => {
    service.eliminarPaciente(2).subscribe((data) => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`${API_BASE}/pacientes/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debe obtener los turnos de un paciente con GET /patients/:id/appointments', () => {
    service.getAppointmentsByPatient(1).subscribe((turnos) => {
      expect(turnos.length).toBe(1);
    });

    const req = httpMock.expectOne(`${API_BASE}/patients/1/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 10, fecha: '2026-11-20', hora: '10:00', razon: 'Control' }]);
  });
});
