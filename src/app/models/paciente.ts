import { Turno } from './turno';

export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  turnos?: Turno[]; // opcional para que cuadre con el template (?.length)
}
