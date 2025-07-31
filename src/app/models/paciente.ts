import { Turno } from './turno';

export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  turnos: Turno[]; // 👈 importante para la relación, aunque no se use aún
}
