// Este modelo representa la estructura de un turno según lo que devuelve el backend.
// El campo 'paciente' es un objeto porque viene con la información del paciente completo.

import { Paciente } from './paciente'; // Importamos el modelo del paciente para representar la relación

export interface Turno {
  id: number;
  fecha: string; // Aunque en el backend es Date, viene como string
  hora: string;
  razon: string;
  paciente: Paciente; // Objeto con los datos del paciente al que pertenece el turno
}
