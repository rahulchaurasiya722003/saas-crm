# NexaCRM

[![Live frontend](https://img.shields.io/badge/live-vercel-black?logo=vercel)](https://nexa-saas-crm.vercel.app/)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

NexaCRM is a full-stack sales CRM for managing leads, companies, contacts, deals, tasks, and customer activity in one workspace. Access is controlled by four roles, and every permission is enforced by the API.

**Live frontend:** https://nexa-saas-crm.vercel.app/

> **Status:** The frontend is deployed. The API is built and runs locally, but public backend hosting is still in progress, so the live site can't load data until the backend is connected.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Roles and permissions](#roles-and-permissions)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

## Features

### Available now

| Module | Description |
| --- | --- |
| **Dashboard** | KPI cards, pipeline charts, and recent activity |
| **Leads** | Capture prospects, assign an owner, and move them through a status flow from new to converted |
| **Companies** | Organizations with industry, location, and headcount |
| **Contacts** | People linked to their company, owner, and history |
| **Deals** | Opportunities with value, probability, and expected close date |
| **Pipeline** | Kanban board across six deal stages, from new to won or lost |
| **Tasks** | Follow-ups with priority levels and statuses |
| **Activities** | Feed of calls, emails, meetings, and status changes |

Across the app, you can also use server-side search and filters, pagination, a `Ctrl+K` command palette, dark mode, and responsive layouts from phone to desktop.

### Authentication

- Email and password sign-up and sign-in. Sign-up creates an organization and its admin account.
- Short-lived JWT access tokens, with rotating refresh tokens stored in HTTP-only cookies.
- Passwords hashed with bcrypt. Refresh tokens stored only as SHA-256 hashes.
- Rate limiting on sign-in and sign-up.
- The Google sign-in button is in place, but it stays disabled until `VITE_GOOGLE_CLIENT_ID` is set and the backend route is built.

### Planned

Call management, email integration, support tickets, workflow automation, AI assistance, two-factor sign-in, and subscription billing. See the [roadmap](#roadmap).

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router, React Hook Form, Zod, Recharts, Lucide icons |
| API | Node.js, Express 5, TypeScript, Zod, Helmet, express-rate-limit, cookie-parser |
| Authentication | JSON Web Tokens (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| Data | PostgreSQL, Prisma 7 ORM with the `pg` adapter |
| Hosting | Vercel (frontend), Render (API and PostgreSQL via blueprint) |

## Architecture

```
┌─────────────────┐   /api/*    ┌─────────────────┐   Prisma   ┌──────────────┐
│  React SPA      │ ──────────▶ │  Express API    │ ─────────▶ │ PostgreSQL   │
│  client/        │  (Vercel    │  server/        │            │              │
└─────────────────┘   rewrite)  └─────────────────┘            └──────────────┘
```

- **Routing:** the client calls relative `/api` paths. In production, `client/vercel.json` forwards them to the API, so the browser sees one origin and the refresh cookie works without cross-site settings.
- **API layers:** routes define endpoints and permissions. Controllers parse input and build responses. Services hold business logic such as sign-in and token rotation. Repositories build the database queries, including organization scoping, search, and pagination.
- **Multi-tenancy:** every record belongs to an organization, and queries are filtered by it.

## Project structure

```
saas-crm/
├── client/                     # React single-page app (Vite)
│   ├── src/
│   │   ├── pages/              # Landing, auth, and CRM screens
│   │   ├── layouts/            # App shell and auth layout
│   │   ├── components/         # Shared UI, layout, and auth components
│   │   ├── features/           # Dashboard widgets
│   │   ├── services/           # API clients
│   │   ├── store/              # Auth, theme, and toast state
│   │   └── lib/                # Axios instance, token refresh, formatting
│   └── vercel.json             # API rewrite and SPA fallback
├── server/                     # Express API
│   ├── prisma/                 # Schema, migrations, and seed data
│   └── src/
│       ├── routes/             # Endpoint definitions and permission checks
│       ├── controllers/        # Request handling
│       ├── services/           # Business logic
│       ├── repositories/       # Database queries
│       ├── middleware/         # Authentication and error handling
│       └── config/             # Environment and permission map
└── render.yaml                 # Render blueprint for the API and database
```

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL (only needed to run the API)

### Run the frontend

```bash
git clone https://github.com/rahulchaurasiya722003/saas-crm.git
cd saas-crm/client
npm install
npm run dev
```

The app runs at http://localhost:5173. Without the API running, the landing page, sign-in, and sign-up screens still load, but data screens won't.

### Run the API

```bash
cd server
cp .env.example .env        # then set DATABASE_URL and both JWT secrets
npm install                 # also generates the Prisma client
npx prisma migrate dev      # applies the schema to your database
npm run seed                # creates the demo organization and users
npm run dev                 # API on http://localhost:4000
```

Check that the API is up at http://localhost:4000/api/health. It should report `"database": "up"`.

### Build for production

```bash
cd client && npm run build      # type-check and output to client/dist
cd server && npm run build      # compile to server/dist
```

## Environment variables

### API (`server/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development` (default), `test`, or `production` |
| `PORT` | No | API port. Defaults to `4000` |
| `CLIENT_URL` | No | Allowed frontend origin for CORS. Defaults to `http://localhost:5173` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | Secret for access tokens. At least 16 characters |
| `JWT_REFRESH_SECRET` | Yes | Secret for refresh tokens. At least 16 characters |

Use long random values for the secrets, for example from `openssl rand -hex 32`.

### Client (`client/.env`, optional)

| Variable | Description |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID. Enables the Google sign-in button once the backend route exists |

## API reference

All responses use the shape `{ success, data, message }`. Protected routes expect `Authorization: Bearer <access token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Server and database status |
| `POST` | `/api/auth/register` | Public | Create an organization and admin account |
| `POST` | `/api/auth/login` | Public | Sign in |
| `POST` | `/api/auth/refresh` | Refresh cookie | Rotate the session |
| `POST` | `/api/auth/logout` | Public | End the session |
| `GET` | `/api/auth/me` | Signed in | Current user |
| `GET` | `/api/dashboard` | Signed in | Dashboard metrics |
| `GET` | `/api/activities` | Signed in | Activity feed |
| `GET` | `/api/search` | Signed in | Search across records |
| `GET` | `/api/notifications` | Signed in | Notifications for the current user |
| `PATCH` | `/api/notifications/:id/read` | Signed in | Mark one notification as read |
| `PATCH` | `/api/notifications/read-all` | Signed in | Mark all notifications as read |
| `GET` | `/api/leads` | `leads:read` | List leads (search, status filter, sort, pagination) |
| `GET` | `/api/companies` | `companies:read` | List companies |
| `GET` | `/api/contacts` | `contacts:read` | List contacts |
| `GET` | `/api/deals` | `deals:read` | List deals |
| `GET` | `/api/deals/pipeline` | `deals:read` | Deals grouped by stage |
| `GET` | `/api/tasks` | `tasks:read` | List tasks |

The API doesn't yet have routes for team management, audit logs, or reports. Those screens show a "coming soon" page for now.

## Roles and permissions

Permissions are defined in `server/src/config/permissions.ts` and checked on every protected request.

| Area | Admin | Manager | Sales agent | Viewer |
| --- | --- | --- | --- | --- |
| Leads, companies, contacts, deals, tasks | Full | Full | Full | Read |
| Reports | Read | Read | None | Read |
| Team management | Full | Full | None | None |
| Audit logs | Read | Read | None | None |
| Organization settings | Full | None | None | None |

## Deployment

### Backend on Render

1. In Render, create a **Blueprint** from your fork of this repository. It provisions the `nexacrm` web service and the `nexacrm-db` PostgreSQL database defined in `render.yaml`.
2. The build installs dependencies, runs `prisma migrate deploy`, and seeds demo data.
3. Set `CLIENT_URL` in the service's environment to your frontend's URL.
4. Note the service's host, for example `nexacrm-xxxx.onrender.com`.

### Frontend on Vercel

1. Import the repository in Vercel, and set **Root Directory** to `client`.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. In `client/vercel.json`, replace `YOUR-RENDER-SERVICE.onrender.com` with your Render host. Commit and push the change.

The Vercel rewrite must point to your own backend host. Until it does, the deployed site can't reach the API.

## Roadmap

- [x] Frontend application and landing page
- [x] Frontend deployment on Vercel
- [x] API, Prisma schema, migrations, and seed data
- [ ] Public backend hosting and a connected deployment
- [ ] Google sign-in (client button in place, backend route pending)
- [ ] Team management, audit log, and reports screens
- [ ] Call management and call transfer
- [ ] Email integration
- [ ] Support tickets with SLA tracking
- [ ] Workflow automation
- [ ] AI assistance (call summaries, lead scoring)
- [ ] Two-factor sign-in
- [ ] Automated tests and CI

## Known limitations

- There are no automated tests yet. The `test` script in `server/package.json` is a placeholder.
- The seed script resets the demo organization each time it runs, and the Render build runs it on every deploy.
- The free Render database expires after a set period. Export your data before then.

## License

Released under the [ISC License](LICENSE).

## Acknowledgements

Original application by [rahulchaurasiya722003](https://github.com/rahulchaurasiya722003).
