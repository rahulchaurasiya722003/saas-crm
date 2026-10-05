# NexaCRM

A full-stack SaaS CRM for managing leads, companies, contacts, deals, tasks, and activity, with role-based access and dashboard analytics.

**Live frontend:** https://nexa-saas-crm.vercel.app/

> **Status:** The frontend is complete and deployed. The backend API is a work in progress and not yet publicly available.

---

## Features

- Dashboard with KPIs and charts
- Leads, companies, and contacts management
- Deals with a kanban pipeline view
- Tasks and an activity feed
- Role-based access: admin, manager, sales agent, viewer
- Command palette (`Ctrl+K`) and dark mode
- Responsive layout from phone to desktop

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router, Recharts, React Hook Form, Zod |
| Backend (in progress) | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT authentication, Zod |
| Deployment | Vercel (frontend) |

## Project structure

```
saas-crm/
├── client/     # React frontend (Vite)
├── server/     # Express API with Prisma (in progress)
└── render.yaml # Render deployment blueprint for the backend
```

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Run the frontend locally

```bash
git clone https://github.com/rahulchaurasiya722003/saas-crm.git
cd saas-crm/client
npm install
npm run dev
```

The app runs at http://localhost:5173.

### Build for production

```bash
cd client
npm run build
```

The output is written to `client/dist`.

## Roadmap

- [x] Frontend pages and layout
- [x] Frontend deployment on Vercel
- [ ] Backend API and PostgreSQL database
- [ ] Authentication wired to the frontend
- [ ] Public backend deployment
- [ ] Automated tests

## Contributing

This project is under active development. Issues and suggestions are welcome.
