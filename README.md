# NexaCRM

A full-stack SaaS CRM with authentication, role-based permissions, dashboard analytics, leads, companies, contacts, deals, a kanban pipeline, tasks, and an activity feed.

## Status

| Component | Status |
| --- | --- |
| Frontend (React + Vite) | ✅ Live: https://nexa-saas-crm.vercel.app/ |
| Backend (Express + Prisma + PostgreSQL) | 🚧 Work in progress, coming soon |

The frontend UI is complete and deployed. Live data, authentication, and API integration are being finalized with the backend, which is not yet publicly available.

## Tech stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router, Recharts, React Hook Form + Zod
- **Backend (planned):** Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT authentication, Helmet, Zod validation
- **Features:** role-based access (admin / manager / sales agent / viewer), dark mode, command palette (Ctrl+K), responsive layout down to phone widths

## Run the frontend locally

Requirements: Node 20+.

```bash
cd client
npm install
npm run dev          # app on http://localhost:5173
```

## Backend (coming soon)

The API server is under active development and will be documented here when it is released. The `server/` folder contains the work in progress and is not yet ready for production use.

## Roadmap

- [x] Frontend pages and layout
- [x] Frontend deployment on Vercel
- [ ] Backend API and database
- [ ] Authentication and role-based access wired to the frontend
- [ ] Public backend deployment
- [ ] Automated tests
