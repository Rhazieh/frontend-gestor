// src/app/models/turno.ts
// -------------------------------------------------------------
// 💡 Qué es esto:
// Un modelo (interface de TypeScript) que describe la forma de un
// "Turno" en el frontend. Nos da autocompletado y chequeo de tipos.
//
// 🧩 Relación con Paciente:
// Cada Turno pertenece a un Paciente. Por eso el campo `paciente`
// es un objeto del tipo `Paciente` (no solo un id).
//
// 🔁 Formatos de fecha/hora:
// En el backend se guardan como tipos SQL (`date` y `time`), pero
// cuando viajan por JSON llegan como strings:
//   - `fecha`: "YYYY-MM-DD"
//   - `hora`: puede llegar "HH:MM" o "HH:MM:SS" según DB/driver.
// En los componentes normalizamos la hora a "HH:MM" cuando hace falta.
//
// 📦 Dónde se usa:
// - En el servicio y componente de turnos.
// - En el listado de pacientes (para contar turnos).
// -------------------------------------------------------------

import { Paciente } from './paciente'; // Relación 1:N (un paciente, muchos turnos)

export interface Turno {
  id: number;
  fecha: string;   // Llega como string (JSON), ej. "2025-08-10"
  hora: string;    // Llega como "HH:MM" o "HH:MM:SS" y la recortamos si hace falta
  razon: string;   // Motivo del turno (texto libre)
  paciente: Paciente; // Objeto con los datos del paciente al que pertenece
}

// ▶ Siguiente archivo recomendado: src/app/navbar/navbar.ts