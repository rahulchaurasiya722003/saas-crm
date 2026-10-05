import { ArrowLeft, Layers, ShieldCheck, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import './auth.css'

interface AuthLayoutProps {
  title: string
  subtitle: string
  footer: { text: string; linkLabel: string; to: string }
  children: React.ReactNode
}

const HIGHLIGHTS = [
  { icon: Workflow, text: 'Leads, deals, and tasks linked to the same customer record' },
  { icon: ShieldCheck, text: 'Role-based access enforced by the server on every request' },
  { icon: Layers, text: 'Organization-scoped data, so each team sees only its own records' },
]

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-slate-900 text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div aria-hidden className="auth-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="auth-blob absolute -top-32 -right-24 size-96 rounded-full bg-info/30 blur-3xl" />
      <div aria-hidden className="auth-blob absolute -bottom-40 -left-20 size-[28rem] rounded-full bg-success/20 blur-3xl" />

      <Link to="/" className="relative z-10 w-fit auth-rise">
        <Logo tone="light" />
      </Link>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
        <div className="relative mx-auto h-72 w-full max-w-md" aria-hidden>
          <div className="auth-float absolute top-0 left-0 w-64 rounded-xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <p className="text-[11px] tracking-wide text-white/70 uppercase">New lead</p>
            <p className="mt-1 font-semibold">Northwind Logistics</p>
            <p className="mt-2 text-xs text-white/70">Assigned to James Cooper</p>
          </div>
          <div className="auth-float-slow absolute top-24 right-0 w-64 rounded-xl border border-white/15 bg-white/15 p-4 shadow-2xl backdrop-blur">
            <p className="text-[11px] tracking-wide text-white/70 uppercase">Deal won</p>
            <p className="mt-1 font-semibold">Harborview Health</p>
            <p className="mt-2 text-lg font-semibold text-success">USD 72,000</p>
          </div>
          <div className="auth-float absolute bottom-0 left-10 w-72 rounded-xl border border-white/15 bg-slate-900/40 p-4 shadow-2xl backdrop-blur" style={{ animationDelay: '-2s' }}>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Pipeline health</span>
              <span>70%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="auth-bar h-full w-[70%] rounded-full bg-gradient-to-r from-info to-success" />
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-md auth-rise auth-rise-1">
          <h2 className="text-3xl font-semibold tracking-tight xl:text-4xl">Your whole sales pipeline, one clear view.</h2>
          <p className="mt-4 text-white/75">Track leads, companies, contacts, and deals in a single workspace built for shared accountability.</p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-white/15">
                  <Icon className="size-4" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative z-10 text-xs text-white/60">Full-stack SaaS CRM · React, Express, Prisma, PostgreSQL</p>
    </aside>
  )
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary lg:grid lg:grid-cols-[1.1fr_1fr]">
      <BrandPanel />

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-10">
          <Link to="/" className="lg:hidden" aria-label="NexaCRM home">
            <Logo />
          </Link>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary">
            <ArrowLeft className="size-4" aria-hidden /> Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-10">
          <div className="auth-rise w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-8">{children}</div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              {footer.text}{' '}
              <Link to={footer.to} className="font-semibold text-primary transition-colors hover:underline">
                {footer.linkLabel}
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
