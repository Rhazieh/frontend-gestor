import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Pacientes } from './pacientes';

describe('Pacientes', () => {
  let component: Pacientes;
  let fixture: ComponentFixture<Pacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pacientes],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // Mockea las peticiones HTTP del servicio
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});