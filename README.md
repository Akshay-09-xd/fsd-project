# Pro-Talent-Connect

<div align="center">

## Full Stack Football Talent Platform

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![API Routes](https://img.shields.io/badge/API%20Routes-55+-007ACC)
![Models](https://img.shields.io/badge/Models-11-6E40C9)

<img src="frontend/src/assets/Logo@pro_talent_connect.png" alt="Pro Talent Connect" width="170" />

Production-ready player discovery and talent operations platform with secured admin workflows and scalable content/data services.

</div>

## Table of Contents

1. [Product Vision](#product-vision)
2. [Core Capabilities](#core-capabilities)
3. [Personas and Access](#personas-and-access)
4. [System Architecture](#system-architecture)
5. [Repository Layout](#repository-layout)
6. [Backend at a Glance](#backend-at-a-glance)
7. [Frontend at a Glance](#frontend-at-a-glance)
8. [Data Domains](#data-domains)
9. [Security and Compliance Posture](#security-and-compliance-posture)
10. [Environment and Configuration](#environment-and-configuration)
11. [Developer Quick Start](#developer-quick-start)
12. [Runbooks](#runbooks)
13. [Quality and Testing Strategy](#quality-and-testing-strategy)
14. [Performance and Reliability](#performance-and-reliability)
15. [Release and Deployment Notes](#release-and-deployment-notes)
16. [Route and Sub-Route Screenshots](#route-and-sub-route-screenshots)
17. [Canonical README Policy](#canonical-readme-policy)

## Product Vision

Pro-Talent-Connect is built to bridge football talent and structured opportunities using a modern web stack and a secure administrative control plane.

Business goals:

- Centralize player profiles, scouting insights, and career context.
- Provide public-facing discovery and trust-building content.
- Enable administrators to operate data workflows quickly and safely.
- Maintain auditability and operational discipline for sensitive changes.

## Core Capabilities

### Public Experience

- Landing page with hero messaging, featured players, and impact metrics.
- Searchable player catalogue and profile detail pages.
- Blog publishing surface for updates and storytelling.
- Services and how-it-works content for onboarding clarity.
- Contact forms for enquiry and profile request submission.

### Admin Experience

- Secure login and token-based session model.
- Admin dashboard for operational visibility.
- Full data operations across players, blogs, about, services, and leagues.
- OTP-assisted sensitive actions.
- Audit log access for privileged roles.

### Platform Operations

- Input validation and sanitization.
- Fine-grained route authorization.
- Request caching for read-heavy surfaces.
- Structured logging and resilient error handling.

## Personas and Access

| Persona | Main Goals | Access Level |
|---|---|---|
| Public Visitor | Discover players, read blogs, submit enquiry/profile request | Public endpoints only |
| Admin | Operate day-to-day player/content workflows | Authenticated admin routes |
| Super Admin | Govern accounts, high-trust controls, audit visibility | Full privileged routes |

## System Architecture

```mermaid
flowchart TB
    U[Public User] --> F[Frontend App]
    A[Admin User] --> F
    F --> B[Backend API]
    B --> M[(MongoDB)]
    B --> E[Email Service]
    B --> L[Log Pipeline]
    B --> C[Cache Middleware]
```

### Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant DB

    Client->>Frontend: Navigate and interact
    Frontend->>Backend: API request
    Backend->>Backend: Security + validation + auth
    Backend->>DB: Query or mutation
    DB-->>Backend: Data
    Backend-->>Frontend: JSON response
    Frontend-->>Client: Rendered UI state
```

## Repository Layout

```text
Pro-Talent-Connect/
|- Backend/
|  |- app.js
|  |- server.js
|  |- config/
|  |- Middleware/
|  |- Models/
|  |- Routes/
|  |- services/
|  |- tests/
|  |- README.md
|- frontend/
|  |- src/
|  |  |- assets/
|  |  |- components/
|  |  |- pages/
|  |  |- services/
|  |  |- tests/
|  |- public/
|  |- README.md
|- docs/
|- README.md
```

## Backend at a Glance

The backend is an Express 5 API with:

- Versioned and compatibility route prefixes.
- Role-based middleware gates.
- Joi validation for critical write/auth flows.
- Global and route-specific rate limiters.
- Mongoose data layer and service-oriented controllers.

Detailed technical documentation:

- [Backend/README.md](Backend/README.md)

## Frontend at a Glance

The frontend is a React 19 SPA with:

- Route-level lazy loading.
- Shared layout components and feature folders.
- Centralized Axios client with token handling.
- Client-side cache and request deduplication helpers.

Detailed technical documentation:

- [frontend/README.md](frontend/README.md)

## Data Domains

Main entities:

- Admin
- Players
- League
- Blog
- About
- Service
- HowItWork
- Enquiry
- ProfileRequest
- Otp
- AuditLog

These domains support public read surfaces and admin mutation workflows with validation and auditability.

## Security and Compliance Posture

Implemented controls include:

- Helmet headers including CSP/HSTS behavior.
- CORS allowlisting through environment configuration.
- JWT authentication and role authorization.
- NoSQL sanitization middleware.
- Rate limiting for API, auth, and create-heavy routes.
- Centralized error shaping.
- Structured request logging.

Credential policy:

- Never commit real credentials to repository documentation.
- Use environment variables for local and deployed secrets.
- Rotate any shared local credentials before production use.

## Environment and Configuration

### Backend

```env
NODE_ENV=development
PORT=5001
MONGO_URI=<mongodb-uri>
JWT_SECRET=<minimum-32-character-secret>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
SUPER_ADMIN_EMAIL=<local-seed-admin-email>
SUPER_ADMIN_PASSWORD=<local-seed-admin-password>
```

### Frontend

```env
VITE_API_URL=http://localhost:5001
```

## Developer Quick Start

### Prerequisites

- Node.js 18+
- npm
- MongoDB (Atlas or local)

### Install

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### Run

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### Smoke Test

- Backend health: `http://localhost:5001/health`
- Frontend app: `http://localhost:5173`

## Runbooks

### New Developer Onboarding

1. Clone repository and install dependencies.
2. Create backend and frontend env files.
3. Start backend, then frontend.
4. Verify login and player listing endpoints.

### Common Data Operations

- Bulk import players: `Backend/import-players-csv.js`
- Data migration routines: `Backend/migrate-data.js`
- HTML test report generation: `Backend/generate-report.js`

### Incident Triage

1. Check backend logs for stack traces and route context.
2. Confirm DB connection status and env correctness.
3. Reproduce via API calls and verify auth/role conditions.
4. Validate rate-limit state and payload schema conformance.

## Quality and Testing Strategy

### Backend

- Jest + Supertest + mongodb-memory-server.
- Current suites cover auth, players, and dashboard flows.

### Frontend

- Vitest + Testing Library + jsdom.
- Component and behavior-level tests under `frontend/src/tests`.

### Suggested Quality Gates

- Lint and test pass required before merge.
- Validate protected routes with role matrix checks.
- Run smoke tests for public and admin journeys.

## Performance and Reliability

Performance controls:

- Response compression.
- Read-path caching with invalidation on writes.
- Request deduplication in frontend API client.

Reliability controls:

- Global error middleware.
- Startup env validation.
- Graceful shutdown hooks.
- Keep-alive worker after DB connection.

## Release and Deployment Notes

Minimum release checks:

- Validate env values and secret strength.
- Confirm CORS domains and HTTPS setup.
- Verify login, players read, admin write, and dashboard stats.
- Confirm monitoring and log ingestion in target environment.

## Route and Sub-Route Screenshots

All captures below are generated from the running application and stored in `frontend/public/readme-images/routes/`.

### Public Routes

| Route | Screenshot |
|---|---|
| `/` | ![Home Route](frontend/public/readme-images/routes/home.png) |
| `/about` | ![About Route](frontend/public/readme-images/routes/about.png) |
| `/players` | ![Players Route](frontend/public/readme-images/routes/players.png) |
| `/blog` | ![Blog Route](frontend/public/readme-images/routes/blog.png) |
| `/blog/:id` | ![Blog Detail Route](frontend/public/readme-images/routes/blog-detail.png) |
| `/services` | ![Services Route](frontend/public/readme-images/routes/services.png) |
| `/contact` | ![Contact Route](frontend/public/readme-images/routes/contact.png) |
| `/login` | ![Login Route](frontend/public/readme-images/routes/login.png) |
| `*` (not found) | ![Not Found Route](frontend/public/readme-images/routes/not-found.png) |

### Admin Routes and Sub-Routes

| Route/Section | Screenshot |
|---|---|
| `/admin` (entry state) | ![Admin Dashboard Route](frontend/public/readme-images/routes/admin-dashboard.png) |
| Overview | ![Admin Overview](frontend/public/readme-images/routes/admin-overview.png) |
| Players | ![Admin Players](frontend/public/readme-images/routes/admin-players.png) |
| Leagues | ![Admin Leagues](frontend/public/readme-images/routes/admin-leagues.png) |
| Enquiries | ![Admin Enquiries](frontend/public/readme-images/routes/admin-enquiries.png) |
| Profile Requests | ![Admin Profile Requests](frontend/public/readme-images/routes/admin-profile-requests.png) |
| Blogs | ![Admin Blogs](frontend/public/readme-images/routes/admin-blogs.png) |
| Services | ![Admin Services](frontend/public/readme-images/routes/admin-services.png) |
| About | ![Admin About](frontend/public/readme-images/routes/admin-about.png) |
| Partners | ![Admin Partners](frontend/public/readme-images/routes/admin-partners.png) |
| Admin Management | ![Admin Admins](frontend/public/readme-images/routes/admin-admins.png) |
| Settings | ![Admin Settings](frontend/public/readme-images/routes/admin-settings.png) |

## Canonical README Policy

This repository intentionally maintains exactly three Markdown README documents:

- Global: [README.md](README.md)
- Backend: [Backend/README.md](Backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
#   f s d - p r o j e c t  
 