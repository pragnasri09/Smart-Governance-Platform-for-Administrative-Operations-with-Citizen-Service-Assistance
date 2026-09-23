# CivicPulse: Smart Governance Platform for Administrative Operations with Citizen Service Assistance

Java 17 / Spring Boot backend implementing the existing `/api` REST contract used by the React application. It uses MySQL 8+, Spring Data JPA, Flyway migrations, BCrypt password hashes, JWT authentication, role-based authorization, CORS, and repeatable demo data.

## Run

1. Create a MySQL database: `CREATE DATABASE civicpulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. Use `.env.example` as a template and set its variables in your terminal or IDE run configuration. Spring Boot does not load `.env` automatically; never commit a real `.env`.
3. Start with `mvn spring-boot:run`, or package with `mvn clean package` and run the jar.

The API listens on port 3000 by default. With demo seeding enabled, the administrator is
`admin1@teamb.com` with password `12345678`. Department staff accounts are listed below and
also use password `12345678`. These credentials are for local development only. Set
`SEED_DEMO=false` and replace all demo passwords before production.

| Department | Staff email |
| --- | --- |
| Public Works | `road1@teamb.com` |
| Water Supply | `water1@teamb.com` |
| Electricity | `electricity1@teamb.com` |
| Sanitation | `sanitation1@teamb.com` |
| Roads & Transport | `transport1@teamb.com` |
| Public Health | `health1@teamb.com` |

## Complaint workflow

New complaints are routed to a department using keywords from the category, title,
and description, then assigned to the least-loaded staff member in that
department. Citizens select the incident location only by clicking the map (or
using the browser GPS control); the server stores the selected coordinates and
does not trust a manually supplied address. Status transitions are enforced
server-side:

```text
ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
REOPENED -> IN_PROGRESS -> RESOLVED
                         -> REJECTED
```

Clients cannot skip or reverse a transition.

After `RESOLVED`, only the complaint citizen can call
`POST /api/complaints/{id}/verify` with `{"accepted":true}` or
`{"accepted":false,"reason":"..."}`. Rejection reopens the complaint and
notifies the assigned staff member. `GET /api/complaints/{id}/timeline` exposes
the immutable business-event history.

Additional data-driven endpoints are:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/complaints/{id}/impact-score` | Deterministic 0–100 score and factor breakdown |
| `GET /api/complaints/{id}/related` | Potentially related complaints with similarity percentages |
| `GET /api/analytics/emerging-issues` | Weekly category/location trend alerts |

Impact weights and similarity thresholds are configurable through
`IMPACT_WEIGHT_*`, `SIMILARITY_RADIUS_KM`, and `SIMILARITY_DAYS` environment
variables. These features are rule-based and intentionally do not call external
AI services.

Complaint submissions require valid latitude and longitude inside India's
boundary. The frontend checks the point immediately, while the backend repeats
the coordinate-based point-in-polygon check before saving. Invalid or missing
coordinates receive a `400 Bad Request`. The map uses OpenStreetMap tiles and
does not require an API key.
