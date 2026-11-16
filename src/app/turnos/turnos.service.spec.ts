import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TurnosService } from './turnos.service';
import { API_BASE } from '../config';

describe('TurnosService', () => {
  let service: TurnosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TurnosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe listar turnos con GET /turnos', () => {
    const mockTurnos = [
      {
        id: 1,
        fecha: '2026-11-20',
        hora: '09:30',
        razon: 'Control',
        paciente: { id: 1, nombre: 'Ana', email: 'ana@test.com', telefono: '123' },
      },
    ];

    service.getTurnos().subscribe((data) => {
      expect(data).toEqual(mockTurnos);
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTurnos);
  });

  it('debe propagar error HTTP distinto de 503 en getTurnos', () => {
    let statusError = 0;

    service.getTurnos().subscribe({
      error: (err) => {
        statusError = err.status;
      },
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    expect(statusError).toBe(500);
  });

  it('debe crear un turno con POST /turnos', () => {
    const payload = { fecha: '2026-11-20', hora: '10:00', razon: 'Consulta' };

    service.crearTurno(payload).subscribe((data) => {
      expect(data.id).toBe(5);
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 5, ...payload });
  });

  it('debe actualizar parcialmente un turno con PATCH /turnos/:id', () => {
    service.actualizarTurnoParcial(5, { hora: '11:00' }).subscribe((data) => {
      expect(data.hora).toBe('11:00');
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos/5`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 5, hora: '11:00' });
  });

  it('debe actualizar un turno completo con PUT /turnos/:id', () => {
    service.actualizarTurnoCompleto(5, { razon: 'Alta' }).subscribe((data) => {
      expect(data.razon).toBe('Alta');
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos/5`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 5, razon: 'Alta' });
  });

  it('debe eliminar un turno con DELETE /turnos/:id', () => {
    service.eliminarTurno(5).subscribe((data) => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`${API_BASE}/turnos/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
