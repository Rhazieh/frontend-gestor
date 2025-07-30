import { Component } from '@angular/core';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes {
  // Por ahora no hay lógica, esto se va a encargar de mostrar la vista de pacientes.
  // Más adelante vamos a hacer que consuma la API del backend, muestre los datos, y permita CRUD.
}
