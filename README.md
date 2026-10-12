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

Indice recomendado de lectura:
1. frontend-gestor/src/main.ts


2. frontend-gestor/src/app/app.ts


3. frontend-gestor/src/app/app.html


4. frontend-gestor/src/app/app.routes.ts


5. frontend-gestor/src/app/config.ts


6. frontend-gestor/src/app/navbar/navbar.ts


7. frontend-gestor/src/app/navbar/navbar.html


8. frontend-gestor/src/app/models/paciente.ts


9. frontend-gestor/src/app/models/turno.ts


10. frontend-gestor/src/app/pacientes/pacientes.service.ts


11. frontend-gestor/src/app/pacientes/pacientes.ts


12. frontend-gestor/src/app/pacientes/pacientes.html


13. frontend-gestor/src/app/turnos/turnos.service.ts


14. frontend-gestor/src/app/turnos/turnos.ts


15. frontend-gestor/src/app/turnos/turnos.html


16. frontend-gestor/src/index.html


17. frontend-gestor/src/styles.css