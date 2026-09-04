# CivicPulse Project Explanation

## 1. Project summary

CivicPulse is a civic-service platform. Citizens submit complaints about public
issues, the application routes each complaint to a department, staff process the
work, and administrators monitor the entire operation.

The repository is a pnpm workspace containing:

- A React 19 and Vite frontend.
- A Java 17 Spring Boot REST API.
- MySQL persistence managed by JPA and Flyway.
- An OpenAPI contract and generated TypeScript clients.
- Shared UI primitives and workspace tooling.

The main request flow is:

1. A user registers or signs in.
2. The API returns a signed JWT.
3. The frontend stores the session and sends the JWT as a bearer token.
4. A citizen submits a complaint with text, coordinates, and an optional photo.
5. The backend selects a department and least-loaded staff member.
6. Notifications are created for the citizen and assigned staff member.
7. Staff update the complaint through the controlled workflow.
8. Administrators view dashboards, manage departments, and may delete complaints.

The system deliberately keeps authorization in the backend. Frontend role
controls are for user experience only and are not a security boundary.

## 2. Repository layout

```text
.
├── artifacts/smart-governance-platform/   React/Vite application
├── lib/api-spec/                          OpenAPI source contract
├── lib/api-client-react/                  Generated React Query client
├── lib/api-zod/                           Generated Zod schemas
├── scripts/                               Workspace helper scripts
├── springboot-server/                     Spring Boot API and database layer
├── attached_assets/                       Input assets retained from the original project
├── .agents/memory/                        Repository-specific agent knowledge
├── .idea/                                 IntelliJ project metadata
├── .vscode/                               VS Code settings
└── root configuration files
```

Generated dependency folders (`node_modules`), Maven output (`target`), and
frontend build output (`dist`) are not source code and are intentionally omitted
from the file-by-file source discussion below.

## 3. Root files

### `.gitattributes`

Defines Git text-file and line-ending behavior so files behave consistently
across Windows and Unix environments.

### `.gitignore`

Prevents secrets, local environment files, dependencies, build output, IDE
files, logs, and generated artifacts from being committed.

### `.npmrc`

Contains pnpm/npm workspace installation settings. It works with the workspace's
catalog versions and package installation policy.

### `.replitignore`

Lists files that should not be included when the project is synchronized with
the Replit environment.

### `LICENSE`

Contains the project's MIT license.

### `package.json`

Defines the private workspace root and the package manager version. Its scripts:

- `preinstall` runs the repository installation guard.
- `typecheck:libs` runs the TypeScript project build.
- `typecheck` checks libraries and application packages.
- `build` typechecks and runs available package build scripts.

The root also pins native Windows-compatible development packages.

### `pnpm-workspace.yaml`

Declares workspace package locations under `artifacts`, `lib`, integrations, and
`scripts`. It provides shared dependency versions through pnpm's `catalog`
feature and defines overrides for patched or platform-specific transitive
packages. The `minimumReleaseAge` setting delays newly published packages as a
supply-chain defense.

Railway must use pnpm rather than npm because workspace manifests use
`catalog:` dependency references.

### `pnpm-lock.yaml`

Records the exact dependency graph resolved by pnpm. Railway's frozen install
requires this file to match `pnpm-workspace.yaml` and all package manifests.

### `README.md`

The operational guide. It documents local Windows setup, MySQL variables,
Spring Boot startup, frontend startup, Railway commands, hosted URLs, security
precautions, complaint photos, map behavior, API code generation, and roles.

### `tsconfig.base.json`

Shared TypeScript compiler settings inherited by workspace packages.

### `tsconfig.json`

Root TypeScript project references and compiler orchestration for the workspace.

## 4. Frontend: `artifacts/smart-governance-platform`

### `package.json`

Defines the frontend package and scripts:

- `dev`: starts Vite on all interfaces.
- `build`: creates the production bundle.
- `serve`: starts `serve.mjs` for Railway.
- `typecheck`: validates the React TypeScript source.

It depends on React, React Leaflet, TanStack Query, Wouter, Lucide icons,
Tailwind, Radix UI primitives, and the generated API client.

### `index.html`

The browser HTML shell. Vite injects the compiled React bundle into this
document, and the React application mounts into its root element.

### `vite.config.ts`

Configures React, Tailwind, runtime error reporting, path aliases, development
proxying, and production output:

- `@` resolves to `src`.
- `/api` is proxied to the local Spring Boot server.
- The build output is `dist/public`.
- `PORT` defaults to `5173` locally and is read from Railway in production.
- `BASE_PATH` controls deployment under a non-root URL.

Replit-only plugins are loaded only outside production.

### `serve.mjs`

The Railway static server. It serves `dist/public`, listens on Railway's
injected `PORT`, supplies an SPA fallback for client-side routes, and serves
static assets directly. The fallback is important because Wouter routes do not
exist as physical files.

### `tsconfig.json`

Frontend-specific TypeScript settings and project references.

### `components.json`

Configuration used by the shadcn/Radix-style UI component setup, including
aliases and styling conventions.

### `.replit-artifact/artifact.toml`

Replit artifact metadata describing how the frontend is treated by the original
development environment.

### `public/favicon.svg`

Browser tab and bookmark icon.

### `public/robots.txt`

Crawler instructions for the hosted frontend.

### `src/main.tsx`

The browser entry point. It imports global styles and mounts the root React
component into the HTML shell, including the error boundary and query-provider
composition used by the application.

### `src/App.tsx`

The main frontend application and the most important UI file. It contains:

- Public landing, About, and Contact views.
- Login and registration flows.
- Role-aware citizen, staff, and administrator dashboards.
- Complaint creation, list, detail, filtering, and status actions.
- Profile editing for name and email only.
- Admin complaint deletion.
- Notification views.
- Leaflet map selection, standard/satellite tiles, and GPS location lookup.
- Optional image selection and browser-side Base64 conversion.

Prominent logic includes:

- TanStack Query hooks call the generated API client and invalidate related data
  after mutations.
- Wouter handles client-side routes.
- The JWT/session state determines which dashboard is displayed.
- Complaint coordinates are updated both by map clicks and by the GPS button.
- `navigator.geolocation.getCurrentPosition` requests high-accuracy location with
  a timeout and reports unsupported/denied GPS access.
- The map marker remains editable after GPS positioning.
- The photo input is optional and rejects files over 5 MB before submission.

### `src/index.css`

The application-wide visual system. It defines typography, colors, page
layouts, responsive behavior, cards, forms, dashboards, complaint details,
Leaflet map sizing, the map-mode and GPS controls, photo previews, and error or
empty states.

The `.complaint-map` rule gives Leaflet a real height. The map controls use a
high stacking order so the GPS button appears above map tiles.

### `src/components/error-boundary.tsx`

React error boundary that catches render-time failures and displays a recovery
interface instead of leaving a blank page.

### `src/components/ui/*.tsx`

These are reusable presentational primitives built mostly on Radix UI. They
provide consistent accessible behavior and styling for the application. The
files are intentionally small and focused:

- `accordion.tsx`: expandable sections.
- `alert-dialog.tsx`: confirmation dialogs for destructive actions.
- `alert.tsx`: inline status and error messages.
- `aspect-ratio.tsx`: constrained aspect-ratio container.
- `avatar.tsx`: user/avatar display.
- `badge.tsx`: compact status labels.
- `breadcrumb.tsx`: navigation hierarchy.
- `button-group.tsx`: grouped actions.
- `button.tsx`: shared button variants and sizes.
- `calendar.tsx`: calendar UI.
- `card.tsx`: card, header, content, footer, and title primitives.
- `carousel.tsx`: carousel structure and controls.
- `chart.tsx`: chart wrappers and theme-aware chart helpers.
- `checkbox.tsx`: accessible checkbox.
- `collapsible.tsx`: expandable/collapsible content.
- `command.tsx`: command palette/list patterns.
- `context-menu.tsx`: right-click menus.
- `dialog.tsx`: modal dialog primitives.
- `drawer.tsx`: mobile drawer/sheet behavior.
- `dropdown-menu.tsx`: accessible dropdown actions.
- `empty.tsx`: empty-state presentation.
- `field.tsx`: form field composition and messages.
- `form.tsx`: form context and validation helpers.
- `hover-card.tsx`: hover-triggered detail card.
- `input-group.tsx`: inputs with attached controls or labels.
- `input-otp.tsx`: one-time-password input.
- `input.tsx`: styled text input.
- `item.tsx`: generic list/item layout.
- `kbd.tsx`: keyboard shortcut label.
- `label.tsx`: accessible form label.
- `menubar.tsx`: desktop menu bar.
- `navigation-menu.tsx`: accessible navigation menu.
- `pagination.tsx`: pagination controls.
- `popover.tsx`: anchored floating content.
- `progress.tsx`: progress indicator.
- `radio-group.tsx`: mutually exclusive choices.
- `resizable.tsx`: resizable panel layout.
- `scroll-area.tsx`: styled scrollable viewport.
- `select.tsx`: select/dropdown primitives.
- `separator.tsx`: visual or semantic divider.
- `sheet.tsx`: side modal panel.
- `sidebar.tsx`: sidebar layout and responsive behavior.
- `skeleton.tsx`: loading placeholder.
- `slider.tsx`: range input.
- `sonner.tsx`, `toast.tsx`, `toaster.tsx`: notifications and toast plumbing.
- `switch.tsx`: boolean toggle.
- `table.tsx`: table structure.
- `tabs.tsx`: tab navigation.
- `textarea.tsx`: multiline input.
- `toggle-group.tsx`, `toggle.tsx`: toggle controls.
- `tooltip.tsx`: hover/focus help text.

These components do not contain CivicPulse business rules; they keep application
markup consistent and accessible.

### `src/hooks/use-mobile.tsx`

React hook that detects whether the viewport matches the mobile breakpoint.

### `src/hooks/use-toast.ts`

Toast state and helper functions used by UI flows that need transient feedback.

### `src/lib/utils.ts`

Shared frontend utility functions, primarily class-name merging and small
presentation helpers.

### `src/pages/not-found.tsx`

Fallback page for unknown client-side routes.

## 5. API contract and generated libraries

### `lib/api-spec/openapi.yaml`

The source-of-truth REST contract. It defines the `/api` base path, endpoint
methods, request validation, response shapes, authentication metadata, roles,
complaint fields, profile updates, notifications, dashboards, and admin
deletion.

The important rule is to edit this file first when an API shape changes, then
regenerate clients.

### `lib/api-spec/orval.config.ts`

Configures Orval to generate the React Query API client and Zod validators from
the OpenAPI document.

### `lib/api-spec/package.json`

Defines the API specification package and its `codegen` script. Code generation
also runs library typechecking.

### `lib/api-client-react/package.json`

Metadata and dependencies for the generated React Query client package.

### `lib/api-client-react/tsconfig.json`

TypeScript settings for the React client package.

### `lib/api-client-react/src/custom-fetch.ts`

The HTTP adapter used by generated hooks. It applies the configured API base
URL, serializes requests, attaches the stored bearer token, parses responses,
and turns HTTP failures into query/mutation errors.

### `lib/api-client-react/src/index.ts`

Public exports for the API client package.

### `lib/api-client-react/src/generated/api.ts`

Generated TanStack Query hooks and request functions for every OpenAPI
operation, including login, registration, complaints, profiles, notifications,
dashboards, and admin deletion.

### `lib/api-client-react/src/generated/api.schemas.ts`

Generated TypeScript request and response types used by the React application.
Do not hand-edit; regenerate from OpenAPI.

### `lib/api-zod/package.json`, `tsconfig.json`, and `src/index.ts`

Package metadata, compiler settings, and public exports for runtime Zod
validation.

### `lib/api-zod/src/generated/api.ts`

Generated Zod schemas corresponding to the API operations.

### `lib/api-zod/src/generated/types/*.ts`

Generated schemas for individual API types: users, roles, auth responses,
departments, complaints, complaint statuses and updates, dashboards,
notifications, contact messages, errors, search parameters, and profile
updates. They validate runtime data and keep consumers aligned with OpenAPI.

## 6. Spring Boot backend

### `springboot-server/pom.xml`

Maven build definition. It uses Spring Boot 3.3.5 and Java 17 with:

- Spring MVC for REST endpoints.
- Spring Data JPA for persistence.
- Spring Security for authorization.
- Bean Validation for request validation.
- Flyway and MySQL migrations.
- JJWT for signed JWT tokens.
- Spring Boot test support.

### `springboot-server/.env.example`

Template for local/deployment variables such as MySQL URL, credentials, JWT
secret, CORS origin, and demo seeding. Spring Boot does not automatically load
`.env`; variables must be exported by the shell or deployment platform.

### `springboot-server/.gitignore`

Backend-specific ignore rules for Maven output, local secrets, IDE files, and
runtime artifacts.

### `springboot-server/README.md`

Backend-focused startup and configuration notes. The root README is the broader
full-stack guide.

### `src/main/java/in/gov/sgp/CivicPulseApplication.java`

Spring Boot application entry point. It starts component scanning, auto
configuration, the embedded server, JPA, security, and Flyway.

### `config/DemoDataSeeder.java`

Optional startup seeding controlled by `SEED_DEMO`. It creates repeatable
departments, users, staff accounts, and demonstration records. It is useful for
local testing but should be disabled and replaced with secure credentials in
production.

### `controller/GovernanceController.java`

REST controller for the main `/api` surface. It maps authentication, profile,
department, complaint, notification, contact, and dashboard operations to the
service layer. `@PreAuthorize` protects role-specific operations, including
admin-only complaint deletion.

### `controller/HealthController.java`

Public liveness endpoints, including `/api/healthz`, used by Railway or other
platform health checks.

### `controller/ApiExceptionHandler.java`

Centralizes known validation, authorization, not-found, duplicate, and other
application errors into predictable HTTP JSON responses.

### `dto/Dtos.java`

Defines request and response records. These are the API boundary types for
users, departments, complaints, notifications, dashboards, registration,
login, profile updates, and contact messages. Validation annotations enforce
required fields and coordinate ranges; optional photo data is capped.

### `model/Role.java`

Enumerates `CITIZEN`, `STAFF`, and `ADMIN` roles.

### `model/ComplaintStatus.java`

Enumerates the complaint workflow states: pending/assigned, in progress,
resolved, and rejected.

### `model/User.java`

JPA entity for accounts. It stores name, unique email, BCrypt password hash,
role, optional department, and timestamps. The role is persisted server-side and
is never accepted from profile-edit requests.

### `model/Department.java`

JPA entity for service departments. Departments have a name, description,
active flag, and timestamps. Deletion is implemented as deactivation so history
remains meaningful.

### `model/Complaint.java`

JPA entity for citizen reports. It stores reference, title, category,
description, readable location, latitude/longitude, optional Base64 photo,
status, citizen, department, assigned staff, remarks, resolution, and
timestamps.

### `model/Notification.java`

JPA entity for in-app notifications. It links a message to a recipient and,
when applicable, a complaint, while tracking read state and creation time.

### `model/ContactMessage.java`

JPA entity for messages submitted through the public Contact form.

### `repository/UserRepository.java`

Spring Data queries for email lookup, role filtering, department staff lookup,
and newest-user listings.

### `repository/DepartmentRepository.java`

Queries departments by name and active state for routing, dropdowns, and admin
management.

### `repository/ComplaintRepository.java`

Queries complaints by citizen, assignment, department, status, timestamps, and
assignment load counts. The load count supports least-loaded staff assignment.

### `repository/NotificationRepository.java`

Queries a user's notifications and count, and removes complaint-linked
notifications before a complaint is deleted to satisfy referential integrity.

### `repository/ContactMessageRepository.java`

Spring Data repository for saved contact messages.

### `security/JwtService.java`

Creates and validates signed JWTs. Tokens identify the authenticated user and
expire according to `JWT_EXPIRATION_MS`.

### `security/JwtAuthFilter.java`

Reads the bearer token on each request, validates it, loads the user, and places
an authenticated principal into Spring Security's context.

### `security/SecurityConfig.java`

Defines password hashing, CORS, stateless JWT security, public endpoints,
authenticated endpoints, and method-level role checks. Passwords are never
stored in plaintext.

### `service/GovernanceService.java`

The backend business-logic layer. It:

- Registers and authenticates users.
- Updates only profile name/email and rejects duplicate email addresses.
- Routes complaints using category/title/description/location keywords or the
  selected department.
- Chooses the least-loaded active staff member in that department.
- Creates citizen and staff assignment notifications.
- Enforces complaint state transitions.
- Restricts staff to assigned complaints and citizens to their own complaints.
- Maps JPA entities into safe DTOs.
- Builds role-specific dashboards.
- Deactivates departments and deletes complaints with dependent notifications.
- Saves optional complaint coordinates and photo data.

The service is transactional, so related persistence operations succeed or fail
together.

### `src/main/resources/application.yml`

Spring configuration. It reads database, JWT, CORS, port, and demo-seeding
values from environment variables, validates the schema with Hibernate, and
runs Flyway migrations automatically.

### `db/migration/V1__create_schema.sql`

Creates the initial MySQL tables, relationships, indexes, and constraints for
users, departments, complaints, notifications, and contact messages.

### `db/migration/V2__add_complaint_coordinates.sql`

Adds nullable latitude and longitude columns to complaints.

### `db/migration/V3__add_complaint_photo.sql`

Adds the nullable `photo_data` LONGTEXT column used for optional incident image
data.

## 7. Scripts and project metadata

### `scripts/package.json`

Metadata and scripts package for workspace maintenance utilities.

### `scripts/preinstall.mjs`

Installation guard that applies repository-specific package-manager and platform
checks before dependencies are installed.

### `scripts/tsconfig.json`

TypeScript settings for maintenance scripts.

### `scripts/src/hello.ts`

Small placeholder/example script retained for the workspace scripts package.

### `.agents/memory/*`

Repository-specific notes used by coding agents. They record dependency-audit
decisions and API route alignment lessons; they are not runtime application
code.

### `.idea/*`

IntelliJ IDEA project metadata such as compiler, module, encoding, VCS, and
workspace settings. These files affect local IDE behavior only.

### `.vscode/settings.json`

VS Code workspace settings for editor behavior.

### `attached_assets/Pasted-Before-publishing-perform-a-complete-technical-audit-of_1788346196333.txt`

An attached audit/request artifact retained from project history. It is
reference material, not an executable part of the application.

## 8. Prominent business rules

### Authentication and roles

- Citizens and staff can register; public registration cannot create admins.
- Passwords are BCrypt-hashed.
- JWTs are stateless and sent in the `Authorization: Bearer ...` header.
- Role checks are enforced in Spring Security and service logic.
- Profile editing cannot change role or department.

### Complaint routing and assignment

The service examines complaint text for department keywords such as electricity,
water, sanitation, health, transport, and public works. If no keyword route is
matched, the requested active department is used. The complaint is then assigned
to the staff member with the lowest current assignment count.

### Complaint workflow

The intended workflow is:

```text
ASSIGNED -> IN_PROGRESS -> RESOLVED
                       └-> REJECTED
```

Staff may update assigned complaints. Administrators can oversee records and
perform administrative actions. Citizens can read their own complaint history
and status.

### Map and GPS

Leaflet displays the complaint map. Users may click to place or move the point,
switch between OpenStreetMap and Esri satellite imagery, or press the GPS button.
The browser Geolocation API requests high accuracy, disables the button while
waiting, centers the map, and writes the detected coordinates into the form.
HTTPS or localhost and explicit browser permission are required.

### Photos

The browser converts an optional image to a Base64 data URL. The API validates
the payload size and stores it in MySQL as `LONGTEXT`. This is appropriate for a
small demonstration deployment; object storage would be preferable at scale.

## 9. Security and deployment model

For local development, start MySQL, export the Spring variables, run
`mvn spring-boot:run` from `springboot-server`, and run the Vite dev server in a
second terminal.

For Railway:

1. Install with pnpm and the frozen lockfile.
2. Build the frontend package.
3. Start `serve.mjs`.
4. Set `VITE_API_URL` on the frontend.
5. Set `CORS_ORIGIN`, database variables, and a random `JWT_SECRET` on the API.
6. Do not manually set Railway's `PORT`.
7. Disable demo seeding and replace demo credentials before production use.

The health endpoint is `/api/healthz`. The frontend is an SPA, so its service
must use the provided static server or an equivalent rewrite-to-`index.html`
configuration.

## 10. Change and verification workflow

When changing an API:

1. Edit `lib/api-spec/openapi.yaml`.
2. Run `pnpm --filter @workspace/api-spec run codegen`.
3. Update backend implementation.
4. Update frontend consumers.
5. Run frontend typecheck/build and `mvn clean package -DskipTests`.

The generated client and Zod files should not be edited manually. Keep Flyway
migrations additive and never rewrite migrations already applied to a shared
database.

