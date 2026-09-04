# CivicPulse: Smart Governance Platform for Administrative Operations with Citizen Service Assistance

CivicPulse is a complete civic-service workflow for reporting issues, processing department work queues, and monitoring service performance. The supported runtime is a React/Vite frontend with a Java Spring Boot API and MySQL database.

## Live Demo
The platform is publicly hosted at https://civicpulse-teamb.up.railway.app/

## What is included

- Public service landing page, About page, and validated Contact form
- Role selection with separate citizen, service staff, and administrator access
- JWT authentication, BCrypt-compatible password hashing, and role-based API authorization
- Citizen complaint submission, history, detail timeline, and notifications
- Optional incident photo upload (maximum 5 MB) visible in complaint details
- Complaint coordinates displayed on the map for citizens, service staff, and administrators
- Staff receive an in-app notification whenever a complaint is assigned to them
- Staff assigned-work queue with status, remarks, and resolution updates
- Administrator dashboards, user/staff directories, department CRUD, complaint oversight, reports, notifications, and direct complaint deletion
- Profile editing for every role (name and email only; role and department remain protected)
- MySQL persistence through Spring Data JPA and Flyway migrations
- OpenAPI-first contract with generated React Query hooks and Zod validators
- Responsive desktop/mobile interface with loading, error, empty, and validation states

## Demo accounts

The API seeds demo data on startup. These accounts are for preview and development only:

| Role          | Email                | Password   |
| ------------- | -------------------- | ---------- |
| Administrator | `admin1@teamb.com`   | `12345678` |
| Citizen       | `citizen1@teamb.com` | `12345678` |
| Service staff | `road1@teamb.com`    | `12345678` |

## Run locally on Windows

### Prerequisites

- Git
- Java 17 or newer
- Maven 3.9+ (or use the Maven wrapper if one is added later)
- Node.js 22+ and pnpm
- MySQL 8+

### 1. Clone and install the frontend

```powershell
git clone https://github.com/pragnasri09/Smart-Governance-Platform-for-Administrative-Operations-with-Citizen-Service-Assistance.git
cd civicpulse1
corepack enable
pnpm install
```

### 2. Create the MySQL database

Run this in MySQL:

```sql
CREATE DATABASE civicpulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Use `springboot-server\.env.example` as a template, then set the values in your
terminal (Spring Boot does not load `.env` automatically):

```powershell
$env:DATABASE_URL="jdbc:mysql://localhost:3306/civicpulse?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DATABASE_USERNAME="root"
$env:DATABASE_PASSWORD="<your-mysql-password>"
$env:JWT_SECRET="<generate-a-private-random-secret-at-least-32-characters>"
$env:CORS_ORIGIN="http://localhost:5173"
```

If you keep a local `.env` file for your own tooling, it is ignored by Git; do not
commit it.

### 3. Start the Spring Boot API

Open a terminal in the repository:

```powershell
cd springboot-server
$env:SEED_DEMO="true"
mvn spring-boot:run
```

Flyway creates and updates the schema automatically. Keep this terminal running.

### 4. Start the React frontend

Open a second terminal:

```powershell
cd civicpulse1
pnpm --filter @workspace/smart-governance-platform run dev
```

Open http://localhost:5173. The Vite proxy forwards `/api` requests to the API on
http://localhost:3000.

The frontend defaults to port `5173` and base path `/`. Set `PORT` or `BASE_PATH`
only when using different deployment values.

### Production/deployment precautions

- Do not commit `.env`, passwords, JWT secrets, database dumps, `node_modules`, Maven `target`, or build output.
- Change every demo password and set `SEED_DEMO=false` before exposing the API publicly.
- Use a dedicated MySQL user with only the permissions this application needs; do not use `root` outside local development.
- Generate a long random `JWT_SECRET` and keep it in the deployment secret manager.
- Restrict `CORS_ORIGIN` to the actual frontend URL, not `*`.
- Do not share real citizen data or production database exports in GitHub.
- GitHub collaborators should use separate accounts and SSH keys/personal access tokens; never share your GitHub password or token.

### Railway frontend deployment

The frontend is part of a pnpm workspace and uses pnpm `catalog:` dependency
versions. Do not use Railway's default `npm install` command.

Configure the frontend service with the repository root as its root directory
(leave the root directory field blank), then use:

```text
Build command:
corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/smart-governance-platform run build

Start command:
pnpm --filter @workspace/smart-governance-platform run serve
```

Set these frontend variables:

```text
BASE_PATH=/
VITE_API_URL=https://<your-spring-boot-service>.up.railway.app
```

Do not set `PORT` manually. Railway supplies the port and the Vite preview
server reads it automatically.

Set the service's output directory to
`artifacts/smart-governance-platform/dist/public` if Railway asks for one.

Current Railway deployment:

```text
Frontend: https://civicpulse-teamb.up.railway.app
Backend:  https://civicpulse-teamb-backend.up.railway.app
Health:   https://civicpulse-teamb-backend.up.railway.app/api/healthz
```

The frontend service uses the repository root, pnpm workspace installation, and
the `serve.mjs` static server. Railway supplies the `PORT` variable; do not set
it manually. Set `VITE_API_URL` to the backend URL above and set the backend
`CORS_ORIGIN` to the frontend URL above.

### Complaint location and photo behavior

Citizens must select the incident point on the map and provide a readable
location. The latitude and longitude are stored in MySQL and shown on the
complaint detail page for every role. Citizens may optionally attach one image
from the complaint form. Images are converted to a data URL and stored in the
complaint record, with a 5 MB limit. The Flyway migration
`V3__add_complaint_photo.sql` creates the required column.

The complaint map supports standard OpenStreetMap tiles and satellite imagery.
The `Use my exact location` control requests browser location permission and
places the marker at the detected coordinates; the user can move the marker
before submitting. Browser geolocation requires HTTPS (or localhost) and user
permission.

Useful checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/smart-governance-platform run typecheck
```

```powershell
$env:PORT="5173"; $env:BASE_PATH="/"; pnpm --filter @workspace/smart-governance-platform run build
```

## Architecture

```text
React + Vite web artifact
        │
        │ generated React Query client
        ▼
Spring Boot API ── JWT / role authorization
        │
        ▼
MySQL via JPA / Flyway
```

### Source-of-truth locations

- `lib/api-spec/openapi.yaml` — REST contract
- `springboot-server/src/main/java/in/gov/sgp/service/GovernanceService.java` — API implementation
- `springboot-server/src/main/java/in/gov/sgp/security/SecurityConfig.java` — authentication and authorization
- `springboot-server/src/main/java/in/gov/sgp/config/DemoDataSeeder.java` — repeatable demo data
- `artifacts/smart-governance-platform/src/App.tsx` — application routes and workflows
- `artifacts/smart-governance-platform/src/index.css` — visual system and responsive styles

If the OpenAPI contract changes, regenerate the client and validators before changing consumers:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Data and security notes

- Passwords are never stored in plaintext.
- Protected routes require a signed bearer token and enforce the user's role server-side.
- Citizens can only view their own complaints.
- Staff can only view and update complaints assigned to them.
- Administrators can view platform-wide records and manage departments.
- Demo credentials and seed data must be replaced or removed before a production rollout.

## License

MIT. See `LICENSE`.
