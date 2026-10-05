import {
  Activity, ArrowRight, Building2, CheckSquare, Columns3, LayoutDashboard, Search, ShieldCheck, Target, Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: Target, title: 'Lead management', text: 'Capture prospects, qualify them, and convert the best ones into deals with a single status flow.' },
  { icon: Building2, title: 'Companies & contacts', text: 'Keep every organization and decision-maker in one directory, linked to the deals they are part of.' },
  { icon: Columns3, title: 'Visual deal pipeline', text: 'Follow every opportunity from new to won or lost, and see the whole pipeline at a glance on one board.' },
  { icon: CheckSquare, title: 'Tasks & follow-ups', text: 'Assign work with priorities and due statuses so nothing slips between calls and meetings.' },
  { icon: Activity, title: 'Activity timeline', text: 'Log calls, emails, meetings, and status changes to build a full history for every account.' },
  { icon: Search, title: 'Fast search & filters', text: 'Find any record instantly, then filter, sort, and page through large lists without slowdowns.' },
]

const ROLES = [
  { name: 'Admin', text: 'Full control, including organization settings and team management.' },
  { name: 'Manager', text: 'Oversees the whole team and every record, without changing organization settings.' },
  { name: 'Sales agent', text: 'Works its own leads, accounts, and deals with full read and write access.' },
  { name: 'Viewer', text: 'Read-only access for stakeholders who need visibility without editing data.' },
]

const STEPS = [
  { n: '01', title: 'Capture', text: 'Add leads and companies as they come in from your website, referrals, or events.' },
  { n: '02', title: 'Organize', text: 'Link contacts, assign owners, and move opportunities through the pipeline.' },
  { n: '03', title: 'Close', text: 'Track tasks and activity until each deal is won, then keep the account history.' },
]

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
        N
      </span>
      <span className="text-base font-semibold tracking-tight">NexaCRM</span>
    </span>
  )
}

function PipelinePreview() {
  const columns = [
    { name: 'New', cards: ['Northwind Logistics', 'Lumen Analytics'] },
    { name: 'Proposal', cards: ['Redwood Capital', 'Silverline Media'] },
    { name: 'Negotiation', cards: ['Atlas Construction'] },
    { name: 'Won', cards: ['Harborview Health'] },
  ]
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-lg shadow-black/5" aria-hidden>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-danger/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-text-muted">Pipeline</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.name} className="rounded-lg bg-surface-muted p-2.5">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-text-muted uppercase">{col.name}</p>
            <div className="space-y-2">
              {col.cards.map((card) => (
                <div key={card} className="rounded-md border border-border bg-surface px-2.5 py-2 text-xs font-medium text-text-primary">
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="NexaCRM home">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-text-secondary md:flex">
            <a href="#features" className="hover:text-text-primary">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary">How it works</a>
            <a href="#roles" className="hover:text-text-primary">Roles</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="inline-flex h-9 items-center rounded-md px-3.5 text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-white hover:opacity-90">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-80 max-w-3xl rounded-full bg-primary/15 blur-3xl" />
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
            <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
              <span className="size-1.5 rounded-full bg-success" /> Built for sales teams
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Close more deals with a CRM your team will actually use
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
              Track leads, companies, and contacts, move deals through a visual pipeline, and see what needs attention today.
              Role-based access keeps every team member focused on the work that is theirs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-white hover:opacity-90">
                Get started <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link to="/login" className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-text-primary hover:bg-surface-muted">
                Sign in to your workspace
              </Link>
            </div>
            <div className="mx-auto mt-14 max-w-4xl text-left">
              <PipelinePreview />
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-border bg-surface-muted/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">Features</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Everything your sales process needs</h2>
              <p className="mt-4 text-text-secondary">From the first conversation to the signed contract, NexaCRM keeps the details in one shared place.</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border border-border bg-surface p-6">
                  <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">From first contact to closed deal</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-lg border border-border bg-surface p-6">
                  <span className="text-sm font-semibold text-primary">{step.n}</span>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="border-t border-border bg-surface-muted/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-primary">Access control</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">The right access for every role</h2>
                <p className="mt-4 text-text-secondary">
                  Permissions are enforced on the server, not just hidden in the interface. Each person sees and changes only what their role allows.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-text-secondary">
                  <ShieldCheck className="size-4 text-success" aria-hidden /> Server-side permission checks on every protected request
                </div>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {ROLES.map((role) => (
                  <li key={role.name} className="rounded-lg border border-border bg-surface p-5">
                    <p className="flex items-center gap-2 font-semibold">
                      <Users className="size-4 text-text-muted" aria-hidden /> {role.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{role.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
              <LayoutDashboard className="mx-auto size-8 text-primary" aria-hidden />
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Ready to run your pipeline in one place?</h2>
              <p className="mx-auto mt-4 max-w-xl text-text-secondary">Create an account and start tracking your leads, deals, and tasks.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-white hover:opacity-90">
                  Create your account <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link to="/login" className="inline-flex h-11 items-center rounded-md px-5 text-sm font-medium text-text-secondary hover:text-text-primary">
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} NexaCRM. Released under the ISC license.</p>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-text-primary">Sign in</Link>
            <Link to="/register" className="hover:text-text-primary">Register</Link>
            <a href="https://github.com/rahulchaurasiya722003/saas-crm" target="_blank" rel="noreferrer" className="hover:text-text-primary">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
