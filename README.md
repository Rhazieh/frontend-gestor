# Gestor de Turnos Médicos — Frontend

[![Frontend CI](https://github.com/Rhazieh/frontend-gestor/actions/workflows/ci.yml/badge.svg)](https://github.com/Rhazieh/frontend-gestor/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Rhazieh/frontend-gestor/graph/badge.svg)](https://codecov.io/gh/Rhazieh/frontend-gestor)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/cece100495774faea251c04f8ba749cd)](https://app.codacy.com/gh/Rhazieh/frontend-gestor/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Single-Page Application (SPA) for the **Gestor de Turnos Médicos** (Medical Appointment Manager) project, built with **Angular** and **TypeScript**. It connects to the NestJS + PostgreSQL backend to manage patients and medical appointments, packaged with multi-stage Docker + Nginx and deployed via GitHub Actions CI/CD to Netlify.

- **Live Deployment (Netlify):** https://marvelous-chebakia-5cb46f.netlify.app/pacientes
- **Backend Repository:** https://github.com/Rhazieh/backend-gestor

---

## Tech Stack

- **Frontend:** Angular 20, TypeScript, HTML, CSS (dark-mode UI)
- **Testing & Quality:** Karma, Jasmine (ChromeHeadless CI), Codecov, Codacy, Dependabot
- **Containers & Orchestration:** Multi-stage Docker (`node:20-alpine` → `nginx:alpine`), Kubernetes (Minikube manifests in `backend-gestor/k8s/`)
- **CI/CD:** GitHub Actions → Netlify

---

## Implemented Features

- Patient CRUD (create, edit, delete, list)
- Appointment CRUD linked to patients
- Appointment filtering by date and patient
- Form validation with user-visible feedback
- Confirmation prompt when deleting patients with existing appointments
- Clean, functional dark-mode styling

---

## Running Locally

1. **Clone the repository:**

```bash
git clone https://github.com/Rhazieh/frontend-gestor.git
cd frontend-gestor
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure the backend base URL (if needed):**

Check `src/app/config.ts` and ensure it points to either:
- Production backend: `https://backend-gestor-zfez.onrender.com`
- Local backend: `http://localhost:3000`

4. **Start the development server:**

```bash
ng serve
```

The application will be available at `http://localhost:4200`.

---

## Testing, CI/CD & Containerization

### Unit Tests & Coverage

```bash
npm run test:ci -- --code-coverage
```

### GitHub Actions Pipeline

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and pull requests to `main`/`master`:

1. Installs dependencies deterministically (`npm ci`) on Node.js 20
2. Runs Angular unit tests headlessly with coverage (`npm run test:ci -- --code-coverage`)
3. Compiles the production bundle (`npm run build`)
4. Uploads coverage reports to **Codecov**
5. On push to `main`, triggers continuous deployment to **Netlify** via `NETLIFY_BUILD_HOOK_URL`

### Docker & Kubernetes (Minikube)

The [`Dockerfile`](Dockerfile) uses a two-stage build (`node:20-alpine` to compile the production Angular bundle and `nginx:alpine` to serve the static output on port `80`).

For local cluster orchestration alongside the API and PostgreSQL, Kubernetes manifests (`05-frontend-deployment.yaml` with 2 replicas, HTTP readiness probe, and `NodePort` `30080`) are maintained in [`backend-gestor/k8s/`](https://github.com/Rhazieh/backend-gestor/tree/main/k8s).

---

## Recommended Code Reading Order

1. `src/main.ts`
2. `src/app/app.ts`
3. `src/app/app.html`
4. `src/app/app.routes.ts`
5. `src/app/config.ts`
6. `src/app/navbar/navbar.ts`
7. `src/app/navbar/navbar.html`
8. `src/app/models/paciente.ts`
9. `src/app/models/turno.ts`
10. `src/app/pacientes/pacientes.service.ts`
11. `src/app/pacientes/pacientes.ts`
12. `src/app/pacientes/pacientes.html`
13. `src/app/turnos/turnos.service.ts`
14. `src/app/turnos/turnos.ts`
15. `src/app/turnos/turnos.html`
16. `src/index.html`
17. `src/styles.css`
