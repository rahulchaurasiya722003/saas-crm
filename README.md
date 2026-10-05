# NexaCRM

A full-stack SaaS CRM with auth, role-based permissions, dashboard analytics, leads, companies, contacts, deals, a kanban pipeline, tasks, and an activity feed.

## 🌐 Live demo

**https://YOUR-VERCEL-APP.vercel.app** _(replace with your deployed URL)_

Demo logins (password for all: `Password123!`):

| Role | Email |
| --- | --- |
| Admin | `admin@nexacrm.dev` |
| Manager | `manager@nexacrm.dev` |
| Sales agent | `agent@nexacrm.dev` |
| Viewer | `viewer@nexacrm.dev` |

> Hosted on Render's free tier — the first request after idle can take ~1 minute while the server wakes up.

## Tech stack

- **Client:** React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router, Recharts, React Hook Form + Zod
- **Server:** Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT auth (access + rotating refresh tokens), Helmet, Zod validation
- **Features:** multi-role RBAC (admin / manager / sales agent / viewer), org-scoped data, server-side pagination + search + filters, dark mode, command palette (Ctrl+K), responsive down to phone widths

## Run locally

Requirements: Node 20+, PostgreSQL.

```bash
# 1. Server
cd server
cp .env.example .env        # fill in DATABASE_URL + JWT secrets
npm install
npx prisma migrate dev
npm run seed                # demo org + users + data
npm run dev                 # API on http://localhost:4000

# 2. Client (new terminal)
cd client
npm install
npm run dev                 # app on http://localhost:5173
```

## Deploy your own

One click with the included [`render.yaml`](render.yaml) blueprint (web service + free PostgreSQL):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR-GITHUB-USER/saas-crm)

In production the Express server serves the built client, so everything runs behind a single URL.
