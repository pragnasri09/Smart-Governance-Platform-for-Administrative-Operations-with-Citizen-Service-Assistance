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

New complaints are routed to a department using keywords from the category, title, description, and location, then assigned to the least-loaded staff member in that department. Status transitions are enforced server-side:

```text
ASSIGNED -> IN_PROGRESS -> RESOLVED
                         -> REJECTED
```

Clients cannot skip or reverse a transition.

Complaint submissions include a readable location plus the selected map latitude and longitude. The map uses OpenStreetMap tiles and does not require an API key.
