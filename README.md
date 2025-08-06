Este es el frontend del proyecto "Gestor de Turnos Médicos", hecho en Angular. Permite gestionar pacientes y turnos desde una interfaz web conectada al backend (NestJS + PostgreSQL). Está desplegado en Netlify.

Tecnologías principales:
- Angular
- HTML / CSS
- TypeScript
- Netlify (deploy)

Cómo correrlo localmente:

1. Clonar el repositorio:
   git clone https://github.com/Rhazieh/frontend-gestor.git

2. Instalar las dependencias:
   npm install

3. Cambiar la URL base del backend si es necesario:
   En los servicios (`.ts`), asegurarse de que apunten a:
   https://backend-gestor-zfez.onrender.com  
   o localhost:3000 si estás trabajando localmente.

4. Ejecutar la app:
   ng serve  
   (por defecto se abre en http://localhost:4200)

Funcionalidades implementadas:

- CRUD de pacientes (crear, editar, eliminar, listar)
- CRUD de turnos (asignados a pacientes)
- Filtrado de turnos por fecha y paciente
- Validaciones de formularios con mensajes visibles
- Confirmación al eliminar pacientes con turnos
- Estilo tipo "modo oscuro" sobrio y funcional

Deploy del frontend en Netlify:  
https://marvelous-chebakia-5cb46f.netlify.app/pacientes

Repositorio del backend:  
https://github.com/Rhazieh/backend-gestor