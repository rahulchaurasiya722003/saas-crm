import {
  Activity,
  ArrowRight,
  Building2,
  CheckSquare,
  ChevronDown,
  Columns3,
  Command,
  Contact,
  Gauge,
  KeyRound,
  Layers,
  LayoutDashboard,
  Menu,
  Phone,
  Server,
  ShieldCheck,
  Target,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
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

/* ---------- navigation data ---------- */

type MenuItem = { label: string; description: string; id?: string; to?: string; href?: string }

const PRODUCT_MENU: MenuItem[] = [
  { id: 'modules', label: 'Modules', description: 'Dashboard, leads, companies, deals, tasks, and activity' },
  { id: 'lifecycle', label: 'Sales lifecycle', description: 'How a lead becomes a won deal' },
  { id: 'access', label: 'Roles & access', description: 'Four roles, enforced on the server' },
  { id: 'platform', label: 'Platform', description: 'Frontend, API, data, and security layers' },
]

const RESOURCES_MENU: MenuItem[] = [
  { id: 'roadmap', label: 'Roadmap', description: 'What is planned next' },
  { href: 'https://github.com/rahulchaurasiya722003/saas-crm', label: 'Source code', description: 'View the project on GitHub' },
  { to: '/login', label: 'Sign in', description: 'Open your workspace' },
]

/* ---------- content (drawn from the real codebase) ---------- */

const STATS = [
  { value: '7', label: 'CRM modules', hint: 'Leads through activity' },
  { value: '4', label: 'Team roles', hint: 'Admin to viewer' },
  { value: '15', label: 'Granular permissions', hint: 'Checked on every request' },
  { value: '6', label: 'Deal stages', hint: 'New to won or lost' },
]

const LIFECYCLE = ['Lead', 'Qualified', 'Deal', 'Negotiation', 'Won', 'Customer']

const MODULES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Gauge, title: 'Dashboard', text: 'Headline KPIs, pipeline charts, and recent activity on one screen, so every day starts with context.' },
  { icon: Target, title: 'Leads', text: 'Capture prospects, assign an owner, and move each one through a status flow from new to converted.' },
  { icon: Building2, title: 'Companies', text: 'Organizations with industry, location, and headcount, linked to every contact and deal they are part of.' },
  { icon: Contact, title: 'Contacts', text: 'The people inside each account, with their owner and history attached to every conversation.' },
  { icon: Columns3, title: 'Deal pipeline', text: 'A kanban board across six stages with deal values and win probabilities, so forecasting stays visible.' },
  { icon: CheckSquare, title: 'Tasks', text: 'Follow-ups with priority levels and statuses, so commitments are never lost between calls and meetings.' },
  { icon: Activity, title: 'Activity feed', text: 'Calls, emails, meetings, and status changes logged as they happen, building a full account history.' },
]

const WORKFLOW = [
  { n: '01', title: 'Capture', text: 'A new enquiry arrives from your website, a referral, or an event. Add it as a lead in seconds and assign an owner.' },
  { n: '02', title: 'Connect', text: 'Link the lead to its company and contacts, so every person and organization sits in one record.' },
  { n: '03', title: 'Progress', text: 'Turn qualified leads into deals, move them across the pipeline, and track the tasks that get them there.' },
  { n: '04', title: 'Review', text: 'Use the dashboard and reports to see where revenue is moving and where the team should focus next.' },
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

const PLATFORM_LAYERS: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: LayoutDashboard, title: 'Frontend', items: ['React 19 with TypeScript', 'Vite build and dev server', 'TanStack Query caching', 'Tailwind CSS v4 design tokens', 'Command palette and dark mode'] },
  { icon: Server, title: 'API', items: ['Express 5 with layered routes', 'Zod validation on every input', 'Rate-limited sign-in and sign-up', 'Helmet security headers', 'Server-side search and pagination'] },
  { icon: Layers, title: 'Data', items: ['PostgreSQL with Prisma 7 ORM', 'Organization-scoped queries', 'Soft delete for recoverable records', 'Versioned migrations and seed data', 'Audit log data model'] },
  { icon: KeyRound, title: 'Security', items: ['Short-lived JWT access tokens', 'Rotating refresh tokens in HTTP-only cookies', 'Refresh tokens stored as SHA-256 hashes', 'Role checks on every protected route', 'Passwords hashed with bcrypt'] },
]

const TECH = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'TanStack Query', 'Express 5', 'Prisma 7', 'PostgreSQL', 'JWT', 'Zod', 'Recharts', 'Helmet']

const ROADMAP: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Phone, title: 'Call management', text: 'Incoming and outgoing call logs, call history per customer, and call transfer between agents.' },
  { icon: ShieldCheck, title: 'Support tickets', text: 'Ticket queues with priority, assignment, status flow, and SLA tracking after the sale.' },
  { icon: Command, title: 'Automation', text: 'Auto-assign leads, create follow-up tasks, and notify managers when important events happen.' },
  { icon: Zap, title: 'AI assistance', text: 'Call and meeting summaries, lead scoring, and follow-up recommendations for sales teams.' },
]

/* ---------- small pieces ---------- */

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

function NavItemLink({ item, onSelect, className }: { item: MenuItem; onSelect: (id: string) => void; className: string }) {
  if (item.id) {
    return (
      <button type="button" role="menuitem" onClick={() => onSelect(item.id!)} className={className}>
        <MenuItemBody item={item} />
      </button>
    )
  }
  if (item.to) {
    return (
      <Link to={item.to} role="menuitem" onClick={() => onSelect('')} className={className}>
        <MenuItemBody item={item} />
      </Link>
    )
  }
  return (
    <a href={item.href} target="_blank" rel="noreferrer" role="menuitem" onClick={() => onSelect('')} className={className}>
      <MenuItemBody item={item} />
    </a>
  )
}

function MenuItemBody({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="block text-sm font-semibold">{item.label}</span>
      <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{item.description}</span>
    </>
  )
}

function NavDropdown({ label, items, onSelect }: { label: string; items: MenuItem[]; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
      >
        {label}
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <div
        role="menu"
        className={`absolute top-full left-1/2 z-50 mt-2 w-80 -translate-x-1/2 rounded-xl border border-border bg-surface p-2 shadow-2xl shadow-black/10 transition duration-200 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {items.map((item) => (
          <NavItemLink
            key={item.label}
            item={item}
            onSelect={(id) => {
              setOpen(false)
              if (id) onSelect(id)
            }}
            className="block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none"
          />
        ))}
      </div>
    </div>
  )
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
          <span className="text-xs text-text-muted">Pipeline</span>
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
        <p className="text-[11px] text-text-muted">Open pipeline</p>
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
    if (id) scrollToSection(id)
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="NexaCRM home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            <NavDropdown label="Product" items={PRODUCT_MENU} onSelect={navigateTo} />
            <NavDropdown label="Resources" items={RESOURCES_MENU} onSelect={navigateTo} />
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
          <div id="mobile-menu" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background/95 backdrop-blur-md md:hidden">
            <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4">
              {[{ title: 'Product', items: PRODUCT_MENU }, { title: 'Resources', items: RESOURCES_MENU }].map((group) => (
                <div key={group.title} className="mb-3">
                  <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-text-muted uppercase">{group.title}</p>
                  {group.items.map((item) => (
                    <NavItemLink
                      key={item.label}
                      item={item}
                      onSelect={navigateTo}
                      className="block w-full rounded-md px-3 py-2.5 text-left hover:bg-surface-muted"
                    />
                  ))}
                </div>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-muted">
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
                <Zap className="size-3.5 text-warning" aria-hidden /> A SaaS CRM for the full customer lifecycle
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                Manage every customer from first enquiry to <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">closed deal</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
                NexaCRM keeps leads, companies, contacts, deals, and tasks in one centralized workspace, so nothing lives in spreadsheets or scattered inboxes.
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

        {/* What is a SaaS CRM */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>What is a SaaS CRM?</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One source of truth for every customer relationship</h2>
              <p className="mt-5 leading-relaxed text-text-secondary">
                A SaaS CRM is a cloud-based platform that organizations use to manage customer relationships, sales activity, and team performance. It replaces scattered spreadsheets and disconnected tools with a single system, available from any browser.
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                NexaCRM focuses on the sales side of that job: capturing leads, assigning them to people, moving deals through a pipeline, and reporting on the results.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <p className="text-sm font-semibold">The customer journey</p>
                <ol className="mt-6 space-y-3">
                  {LIFECYCLE.map((stage, i) => (
                    <li key={stage} className="flex items-center gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                      <span className="flex-1 rounded-lg bg-surface-muted px-4 py-2.5 text-sm font-medium">{stage}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-20 sm:px-6">
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

        {/* Modules */}
        <section id="modules" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Modules</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Every sales module, connected</h2>
              <p className="mt-4 text-text-secondary">The modules share the same data, so a deal always knows its company, its contacts, and its open tasks.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map(({ icon: Icon, title, text }, i) => (
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
                    Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">Ctrl</kbd> + <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">K</kbd> to jump to any page from anywhere in the app.
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Lifecycle / workflow */}
        <section id="lifecycle" className="scroll-mt-20 border-y border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Sales lifecycle</Eyebrow>
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
              <Eyebrow>Roles & access</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Each role sees exactly what it needs</h2>
              <p className="mt-4 text-text-secondary">
                Admins, managers, sales agents, and viewers each get a defined level of access. The API checks it on every protected request.
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

        {/* Platform */}
        <section id="platform" className="scroll-mt-20 border-t border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Platform</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built as a complete full-stack system</h2>
              <p className="mt-4 text-text-secondary">A typed frontend, a layered API, and a relational data model, wired together end to end.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {PLATFORM_LAYERS.map(({ icon: Icon, title, items }, i) => (
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

        {/* Roadmap */}
        <section id="roadmap" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Roadmap</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What we are building next</h2>
              <p className="mt-4 text-text-secondary">These capabilities are planned and not yet available in the current release.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {ROADMAP.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={(i % 2) * 100}>
                  <article className="flex h-full gap-4 rounded-xl border border-dashed border-border bg-surface p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{title}</h3>
                        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">Planned</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-24">
          <Reveal className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-xl shadow-black/5 sm:px-12">
              <div aria-hidden className="landing-glow pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
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
