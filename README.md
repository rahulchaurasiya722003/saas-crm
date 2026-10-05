# NexaCRM

[![Live](https://img.shields.io/badge/live-vercel-black?logo=vercel)](https://nexa-saas-crm.vercel.app/)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

A full-stack SaaS CRM for managing leads, companies, contacts, deals, tasks, and activity, with role-based access control and dashboard analytics.

**Live demo:** https://nexa-saas-crm.vercel.app/

> The frontend is deployed. The backend API is under active development and not yet publicly hosted.

## Features

- Dashboard with KPI cards and charts
- Leads, companies, and contacts with server-side search and pagination
- Deals with a kanban pipeline view
- Tasks and an activity feed
- Role-based access control: admin, manager, sales agent, viewer
- Command palette (`Ctrl+K`), dark mode, and responsive layout

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router, Recharts, React Hook Form, Zod |
| Backend | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT (access and rotating refresh tokens), Helmet, express-rate-limit, Zod |
| Hosting | Vercel (frontend), Render (backend blueprint) |

## Architecture

```
┌──────────────┐   /api/*    ┌──────────────┐   Prisma   ┌──────────────┐
│  Vite SPA    │ ──────────▶ │ Express API  │ ─────────▶ │ PostgreSQL   │
│  (client/)   │  (Vercel    │ (server/)    │            │              │
└──────────────┘   rewrite)  └──────────────┘            └──────────────┘
```

The client calls relative `/api` paths. In production, `client/vercel.json` proxies those requests to the API, so the browser sees a single origin and the HTTP-only refresh cookie works without cross-site configuration.

## Project structure

```
saas-crm/
├── client/          # React SPA (Vite)
│   ├── src/pages/       # Route-level screens
│   ├── src/features/    # Feature modules (dashboard)
│   ├── src/services/    # API clients
│   └── vercel.json      # Deployment rewrites
├── server/          # Express API (in progress)
│   ├── prisma/          # Schema, migrations, seed
│   └── src/             # Routes, controllers, services, repositories
└── render.yaml      # Render blueprint (API + PostgreSQL)
```

## API overview

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` `/login` `/refresh` `/logout` | Public |
| `GET` | `/api/auth/me` | Authenticated |
| `GET` | `/api/dashboard` | Authenticated |
| `GET` | `/api/leads` `/companies` `/contacts` | Role-based (`*:read`) |
| `GET` | `/api/deals`, `/api/deals/pipeline` | Role-based (`deals:read`) |
| `GET` | `/api/tasks` | Role-based (`tasks:read`) |
| `GET` | `/api/activities` | Authenticated |
| `GET` | `/api/search`, `/api/notifications` | Authenticated |
| `PATCH` | `/api/notifications/:id/read`, `/api/notifications/read-all` | Authenticated |
| `GET` | `/api/health` | Public |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Frontend

```bash
git clone https://github.com/rahulchaurasiya722003/saas-crm.git
cd saas-crm/client
npm install
npm run dev
```

The app runs at http://localhost:5173.

```bash
npm run build     # type-check and production build to client/dist
npm run lint      # oxlint
```

### Backend (preview)

Requires PostgreSQL. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` and the JWT secrets.

```bash
cd server
npm install
npx prisma migrate dev
npm run seed      # demo organization and users
npm run dev       # API on http://localhost:4000
```

## Roadmap

- [x] Frontend UI and deployment
- [x] Backend API scaffold, Prisma schema, and migrations
- [ ] Wire the frontend to live API data end to end
- [ ] Public backend deployment
- [ ] Automated test suite (API and UI)
- [ ] CI pipeline

## License

Released under the [ISC License](LICENSE).
