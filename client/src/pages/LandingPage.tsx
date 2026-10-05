import {
  Activity,
  ArrowRight,
  Building2,
  CheckSquare,
  Columns3,
  Command,
  Contact,
  Gauge,
  KeyRound,
  Layers,
  LayoutDashboard,
  Menu,
  Moon,
  Server,
  ShieldCheck,
  Target,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './landing.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const CURRENT_YEAR = new Date().getFullYear()

/* ---------- hooks & helpers ---------- */

function useScrollState() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 12)
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    // Batch scroll updates to one per frame so scrolling stays smooth.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return { scrolled, progress }
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // Users who prefer reduced motion start visible, so no animation runs at all.
  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`landing-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

/* ---------- content (drawn from the real codebase) ---------- */

const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'access', label: 'Access' },
  { id: 'stack', label: 'Tech' },
]

const STATS = [
  { value: '7', label: 'CRM modules', hint: 'Leads to activities' },
  { value: '4', label: 'Team roles', hint: 'Admin to viewer' },
  { value: '15', label: 'Granular permissions', hint: 'Enforced on the server' },
  { value: '15 min', label: 'Access token lifetime', hint: 'Rotating refresh tokens' },
]

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Gauge, title: 'Dashboard', text: 'Headline KPIs, pipeline charts, and recent activity on one screen, so the day starts with context.' },
  { icon: Target, title: 'Leads', text: 'Capture prospects with a status flow from new through qualified or converted. Search and filter across the full list.' },
  { icon: Building2, title: 'Companies', text: 'Organizations with industry, location, and headcount, linked to every contact and deal that involves them.' },
  { icon: Contact, title: 'Contacts', text: 'People inside each account, with the right owner and history attached to every conversation.' },
  { icon: Columns3, title: 'Deal pipeline', text: 'A kanban board across six stages, from new to won or lost, with values and probabilities per deal.' },
  { icon: CheckSquare, title: 'Tasks', text: 'Follow-ups with priority levels and status tracking, so commitments are never lost between calls.' },
  { icon: Activity, title: 'Activity feed', text: 'Calls, emails, meetings, and status changes logged as they happen, building a full account history.' },
]

const WORKFLOW = [
  { n: '01', title: 'Capture', text: 'A new lead arrives from your website, a referral, or an event. Add it in seconds and assign an owner.' },
  { n: '02', title: 'Qualify & connect', text: 'Link the company and its contacts, then move the opportunity into the pipeline as a deal.' },
  { n: '03', title: 'Progress', text: 'Track tasks and log every call and meeting. Move the deal through each stage until it is won.' },
  { n: '04', title: 'Review', text: 'Watch the dashboard and reports for where revenue is moving, and where to focus next.' },
]

type Level = 'write' | 'read' | 'none'

// Mirrors server/src/config/permissions.ts so the table always matches what the API enforces.
const ACCESS_MATRIX: { area: string; admin: Level; manager: Level; agent: Level; viewer: Level }[] = [
  { area: 'Leads', admin: 'write', manager: 'write', agent: 'write', viewer: 'read' },
  { area: 'Companies', admin: 'write', manager: 'write', agent: 'write', viewer: 'read' },
  { area: 'Contacts', admin: 'write', manager: 'write', agent: 'write', viewer: 'read' },
  { area: 'Deals & pipeline', admin: 'write', manager: 'write', agent: 'write', viewer: 'read' },
  { area: 'Tasks', admin: 'write', manager: 'write', agent: 'write', viewer: 'read' },
  { area: 'Reports', admin: 'read', manager: 'read', agent: 'none', viewer: 'read' },
  { area: 'Team management', admin: 'write', manager: 'write', agent: 'none', viewer: 'none' },
  { area: 'Audit logs', admin: 'read', manager: 'read', agent: 'none', viewer: 'none' },
  { area: 'Organization settings', admin: 'write', manager: 'none', agent: 'none', viewer: 'none' },
]

const TECH = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'TanStack Query', 'Express 5', 'Prisma 7', 'PostgreSQL', 'JWT', 'Zod', 'Recharts', 'Helmet']

const STACK_LAYERS: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: LayoutDashboard, title: 'Frontend', items: ['React 19 with TypeScript', 'Vite build and dev server', 'TanStack Query caching', 'Tailwind CSS v4 design tokens', 'Command palette and dark mode'] },
  { icon: Server, title: 'API', items: ['Express 5 with layered routes', 'Zod validation on every input', 'Rate-limited sign-in and sign-up', 'Helmet security headers', 'Server-side search and pagination'] },
  { icon: Layers, title: 'Data', items: ['PostgreSQL with Prisma 7 ORM', 'Organization-scoped queries', 'Soft delete for recoverable records', 'Versioned migrations and seed data', 'Audit log model'] },
  { icon: KeyRound, title: 'Security', items: ['Short-lived JWT access tokens', 'Rotating refresh tokens in HTTP-only cookies', 'Refresh tokens stored as SHA-256 hashes', 'Role checks on every protected route', 'Passwords hashed with bcrypt'] },
]

/* ---------- small pieces ---------- */

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white shadow-md shadow-primary/30">
        N
      </span>
      <span className="text-base font-semibold tracking-tight">NexaCRM</span>
    </span>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{children}</p>
}

function LevelBadge({ level }: { level: Level }) {
  const styles: Record<Level, string> = {
    write: 'bg-success/15 text-success',
    read: 'bg-info/15 text-info',
    none: 'bg-surface-muted text-text-muted',
  }
  const labels: Record<Level, string> = { write: 'Full access', read: 'Read only', none: 'No access' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${styles[level]}`}>{labels[level]}</span>
}

function HeroPreview() {
  const columns = [
    { name: 'New', color: 'bg-info', cards: [['Northwind Logistics', 'USD 24k'], ['Lumen Analytics', 'USD 9k']] },
    { name: 'Proposal', color: 'bg-warning', cards: [['Redwood Capital', 'USD 61k']] },
    { name: 'Negotiation', color: 'bg-primary', cards: [['Atlas Construction', 'USD 38k']] },
    { name: 'Won', color: 'bg-success', cards: [['Harborview Health', 'USD 72k']] },
  ]
  return (
    <div className="relative mx-auto mt-16 max-w-5xl" aria-hidden>
      <div className="landing-glow pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-info/20 to-success/20 blur-3xl" />
      <div className="rounded-2xl border border-border bg-surface/90 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </div>
          <span className="text-xs text-text-muted">Pipeline · Q4</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.name} className="rounded-xl bg-surface-muted p-3">
              <div className="mb-3 flex items-center gap-2">
                <span className={`size-2 rounded-full ${col.color}`} />
                <p className="text-[11px] font-semibold tracking-wide text-text-muted uppercase">{col.name}</p>
              </div>
              <div className="space-y-2.5">
                {col.cards.map(([name, value]) => (
                  <div key={name} className="rounded-lg border border-border bg-surface p-2.5 shadow-sm">
                    <p className="truncate text-xs font-semibold text-text-primary">{name}</p>
                    <p className="mt-1 text-[11px] text-text-muted">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="landing-float absolute -top-5 -left-3 hidden rounded-xl border border-border bg-surface px-4 py-3 shadow-xl sm:block">
        <p className="text-[11px] text-text-muted">Open deal value</p>
        <p className="text-lg font-semibold">USD 195k</p>
      </div>
      <div className="landing-float-slow absolute -right-3 -bottom-6 hidden items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-xl sm:flex">
        <span className="landing-pulse size-2.5 rounded-full bg-success" />
        <p className="text-sm font-medium">Deal moved to Won</p>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export function LandingPage() {
  const { scrolled, progress } = useScrollState()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const navigateTo = (id: string) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-text-primary antialiased">
      {/* Scroll progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary" style={{ transform: `scaleX(${progress})` }} aria-hidden />

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled || menuOpen ? 'border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="NexaCRM home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => navigateTo(link.id)}
                className="rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden h-9 items-center rounded-md px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-white shadow-md shadow-primary/25 transition hover:-translate-y-px hover:opacity-95">
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-surface md:hidden"
            >
              {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
            <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {NAV_LINKS.map((link) => (
                <button key={link.id} type="button" onClick={() => navigateTo(link.id)} className="rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-surface-muted">
                  {link.label}
                </button>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-text-secondary hover:bg-surface-muted">
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 sm:pt-40">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[32rem] max-w-4xl rounded-full bg-primary/15 blur-3xl" />
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur">
                <Zap className="size-3.5 text-warning" aria-hidden /> Full-stack CRM for modern sales teams
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                Run your entire sales pipeline in <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">one place</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
                NexaCRM tracks leads, companies, contacts, deals, and tasks, with role-based access enforced on the server. Know what needs attention today and where revenue is heading.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/register" className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:opacity-95">
                  Get started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <Link to="/login" className="inline-flex h-12 items-center rounded-lg border border-border bg-surface px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-surface-muted">
                  Sign in to workspace
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={320}>
            <HeroPreview />
          </Reveal>
        </section>

        {/* Tech marquee */}
        <section aria-label="Technologies used" className="border-y border-border bg-surface-muted/40 py-5">
          <div className="overflow-hidden">
            <div className="landing-marquee flex w-max gap-10 whitespace-nowrap">
              {[...TECH, ...TECH].map((tech, i) => (
                <span key={`${tech}-${i}`} className="text-sm font-medium text-text-muted">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="bg-surface p-6 sm:p-8">
                <p className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold">{stat.label}</p>
                <p className="mt-1 text-xs text-text-muted">{stat.hint}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Features</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Every part of the sales process, connected</h2>
              <p className="mt-4 text-text-secondary">Seven CRM modules share the same data, so a deal always knows its company, its contacts, and its open tasks.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={(i % 3) * 90}>
                  <article className="group h-full rounded-xl border border-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={180}>
                <article className="flex h-full flex-col justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6">
                  <Command className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold">Keyboard first</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">Ctrl</kbd> + <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">K</kbd> to jump to any page, and use the dark theme on long sessions.
                  </p>
                  <Moon className="mt-4 size-4 text-text-muted" aria-hidden />
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="scroll-mt-20 border-y border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Workflow</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From first contact to closed deal</h2>
            </Reveal>
            <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
              <span aria-hidden className="absolute top-5 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
              {WORKFLOW.map((step, i) => (
                <Reveal key={step.n} delay={i * 110}>
                  <li className="relative list-none text-center md:px-2">
                    <span className="mx-auto flex size-10 items-center justify-center rounded-full border border-primary/40 bg-background text-sm font-semibold text-primary shadow-sm">
                      {step.n}
                    </span>
                    <h3 className="mt-5 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Access */}
        <section id="access" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Access control</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Each role sees exactly what it needs</h2>
              <p className="mt-4 text-text-secondary">
                Permissions are checked by the API on every protected request, so hiding a button is never the only safeguard.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted/60">
                      <th scope="col" className="px-5 py-4 font-semibold">Area</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Admin</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Manager</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Sales agent</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACCESS_MATRIX.map((row) => (
                      <tr key={row.area} className="border-b border-border last:border-0 transition-colors hover:bg-surface-muted/40">
                        <th scope="row" className="px-5 py-3.5 font-medium">{row.area}</th>
                        <td className="px-5 py-3.5"><LevelBadge level={row.admin} /></td>
                        <td className="px-5 py-3.5"><LevelBadge level={row.manager} /></td>
                        <td className="px-5 py-3.5"><LevelBadge level={row.agent} /></td>
                        <td className="px-5 py-3.5"><LevelBadge level={row.viewer} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={160} className="mt-6 flex items-center justify-center gap-2 text-sm text-text-secondary">
              <ShieldCheck className="size-4 text-success" aria-hidden /> Matches the server permission map in <code className="rounded bg-surface-muted px-1.5 py-0.5 text-xs">permissions.ts</code>
            </Reveal>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="scroll-mt-20 border-t border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Under the hood</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built as a complete full-stack system</h2>
              <p className="mt-4 text-text-secondary">A typed frontend, a layered API, and a relational data model, wired together end to end.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {STACK_LAYERS.map(({ icon: Icon, title, items }, i) => (
                <Reveal key={title} delay={(i % 2) * 100}>
                  <div className="h-full rounded-xl border border-border bg-surface p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="font-semibold">{title}</h3>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-xl shadow-black/5 sm:px-12">
              <div aria-hidden className="landing-glow pointer-events-none absolute -top-24 left-1/2 -z-0 size-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                  <LayoutDashboard className="size-6" aria-hidden />
                </span>
                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Start managing your pipeline today</h2>
                <p className="mx-auto mt-4 max-w-xl text-text-secondary">Create an account and bring your leads, accounts, and deals into one workspace.</p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/register" className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:opacity-95">
                    Create your account <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link to="/login" className="inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold text-text-secondary transition hover:text-text-primary">
                    I already have an account
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-10 text-sm text-text-muted sm:flex-row sm:px-6">
          <Logo />
          <p className="text-center">© {CURRENT_YEAR} NexaCRM. Released under the ISC license.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="transition-colors hover:text-text-primary">Sign in</Link>
            <Link to="/register" className="transition-colors hover:text-text-primary">Register</Link>
            <a href="https://github.com/rahulchaurasiya722003/saas-crm" target="_blank" rel="noreferrer" className="transition-colors hover:text-text-primary">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
