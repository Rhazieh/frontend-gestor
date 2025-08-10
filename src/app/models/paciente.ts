// src/app/models/paciente.ts
// -------------------------------------------------------------
//  Qué es esto:
// Un "modelo" (interface de TypeScript) que describe cómo luce
// un Paciente en el frontend. Nos sirve para que el compilador
// nos avise si estamos usando mal alguna propiedad.
//
//  Relación con Turno:
// Un Paciente puede tener muchos Turnos. Por eso importamos
// la interface Turno y el campo `turnos` es un array (opcional).
//
//  Dónde se usa:
// - En componentes y servicios que manejan pacientes
//   (pacientes.service.ts, pacientes.ts, turnos.ts, etc.).
// -------------------------------------------------------------

import { Turno } from './turno';

export interface Paciente {
  // Identificador único del paciente (mapeado 1:1 con el backend)
  id: number;

  // Nombre y apellido tal como lo guarda el backend
  nombre: string;

  // Email de contacto del paciente
  email: string;

  // Teléfono de contacto (en el frontend lo validamos como string de dígitos)
  telefono: string;

  // Lista de turnos asociados a este paciente.
  // Lo marcamos como opcional (?) porque a veces el backend puede no incluir
  // la relación, y en las plantillas usamos "paciente.turnos?.length".
  turnos?: Turno[]; // opcional para que cuadre con el template (?.length)
}