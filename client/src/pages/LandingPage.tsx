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
  Plus,
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

const SECTION_IDS = ['features', 'customer', 'pipeline', 'security', 'roadmap', 'faq']

// Highlights the nav item for the section currently in view.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
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
  { id: 'features', label: 'Modules', description: 'Dashboard, leads, companies, deals, tasks, and activity' },
  { id: 'customer', label: 'Customer 360°', description: 'Every contact, deal, and task on one record' },
  { id: 'pipeline', label: 'Sales pipeline', description: 'Track deals across six stages' },
  { id: 'security', label: 'Security & roles', description: 'Four roles, enforced on the server' },
]

const RESOURCES_MENU: MenuItem[] = [
  { id: 'roadmap', label: 'Roadmap', description: 'What is planned next' },
  { id: 'faq', label: 'FAQ', description: 'Common questions answered' },
  { href: 'https://github.com/rahulchaurasiya722003/saas-crm', label: 'Source code', description: 'View the project on GitHub' },
]

/* ---------- content (drawn from the real codebase) ---------- */

const STATS = [
  { value: '7', label: 'CRM modules', hint: 'Leads through activity' },
  { value: '4', label: 'Team roles', hint: 'Admin to viewer' },
  { value: '15', label: 'Granular permissions', hint: 'Checked on every request' },
  { value: '6', label: 'Deal stages', hint: 'New to won or lost' },
]

const MODULES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Gauge, title: 'Dashboard', text: 'Headline KPIs, pipeline charts, and recent activity on one screen, so every day starts with context.' },
  { icon: Target, title: 'Leads', text: 'Capture prospects, assign an owner, and move each one through a status flow from new to converted.' },
  { icon: Building2, title: 'Companies', text: 'Organizations with industry, location, and headcount, linked to every contact and deal they are part of.' },
  { icon: Contact, title: 'Contacts', text: 'The people inside each account, with their owner and history attached to every conversation.' },
  { icon: Columns3, title: 'Deal pipeline', text: 'A board across six stages with deal values and win probabilities, so forecasting stays visible.' },
  { icon: CheckSquare, title: 'Tasks', text: 'Follow-ups with priority levels and statuses, so commitments are never lost between calls and meetings.' },
  { icon: Activity, title: 'Activity feed', text: 'Calls, emails, meetings, and status changes logged as they happen, building a full account history.' },
]

const TIMELINE = [
  { kind: 'Meeting', text: 'Discussed rollout timeline with the operations team', when: 'Today, 10:20' },
  { kind: 'Deal', text: 'Moved to Proposal at USD 61,000', when: 'Yesterday' },
  { kind: 'Task', text: 'Send pricing sheet, marked completed', when: 'Mon' },
  { kind: 'Note', text: 'Decision maker prefers a quarterly review', when: 'Last week' },
]

const PIPELINE: { stage: string; tone: string; cards: { company: string; value: string; owner: string }[] }[] = [
  { stage: 'New', tone: 'bg-info', cards: [{ company: 'Northwind Logistics', value: 'USD 24k', owner: 'James C.' }, { company: 'Lumen Analytics', value: 'USD 9k', owner: 'Maya I.' }] },
  { stage: 'Qualified', tone: 'bg-primary', cards: [{ company: 'Bluepeak Software', value: 'USD 18k', owner: 'Priya N.' }] },
  { stage: 'Proposal', tone: 'bg-warning', cards: [{ company: 'Redwood Capital', value: 'USD 61k', owner: 'James C.' }] },
  { stage: 'Negotiation', tone: 'bg-danger', cards: [{ company: 'Atlas Construction', value: 'USD 38k', owner: 'Omar H.' }] },
  { stage: 'Won', tone: 'bg-success', cards: [{ company: 'Harborview Health', value: 'USD 72k', owner: 'Maya I.' }] },
  { stage: 'Lost', tone: 'bg-text-muted', cards: [{ company: 'Silverline Media', value: 'USD 12k', owner: 'Aiden B.' }] },
]

const SECURITY_POINTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: 'Role-based access', text: 'Admins, managers, sales agents, and viewers each get a defined set of permissions.' },
  { icon: KeyRound, title: 'Secure sessions', text: 'Short-lived access tokens, with rotating refresh tokens in HTTP-only cookies.' },
  { icon: Layers, title: 'Organization-scoped data', text: 'Every query is filtered by organization, so one team never sees another team\'s records.' },
  { icon: Server, title: 'Hardened API', text: 'Helmet security headers, rate-limited sign-in, and Zod validation on every input.' },
]

const ROLES_MATRIX: { area: string; admin: string; manager: string; agent: string; viewer: string }[] = [
  { area: 'Leads, companies, contacts, deals, tasks', admin: 'Full', manager: 'Full', agent: 'Full', viewer: 'Read' },
  { area: 'Reports', admin: 'Read', manager: 'Read', agent: 'None', viewer: 'Read' },
  { area: 'Team management', admin: 'Full', manager: 'Full', agent: 'None', viewer: 'None' },
  { area: 'Audit logs', admin: 'Read', manager: 'Read', agent: 'None', viewer: 'None' },
  { area: 'Organization settings', admin: 'Full', manager: 'None', agent: 'None', viewer: 'None' },
]

const PLATFORM_LAYERS: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: LayoutDashboard, title: 'Frontend', items: ['React 19 with TypeScript', 'Vite build and dev server', 'TanStack Query caching', 'Tailwind CSS v4 design tokens'] },
  { icon: Server, title: 'API', items: ['Express 5 with layered routes', 'Zod validation on every input', 'Server-side search and pagination'] },
  { icon: Layers, title: 'Data', items: ['PostgreSQL with Prisma 7 ORM', 'Soft delete for recoverable records', 'Versioned migrations and seed data'] },
]

const TECH = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'TanStack Query', 'Express 5', 'Prisma 7', 'PostgreSQL', 'JWT', 'Zod', 'Recharts', 'Helmet']

// Planned features. None of these are built yet, so they're labelled as such.
const ROADMAP: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Phone, title: 'Call management', text: 'Call logs per customer, plus call transfer and parking between agents for contact-center teams.' },
  { icon: Command, title: 'Workflow automation', text: 'Auto-assign new leads, create follow-up tasks, and notify managers when important events happen.' },
  { icon: ShieldCheck, title: 'Support tickets', text: 'Ticket queues with priority, assignment, status flow, and SLA tracking after the sale.' },
  { icon: Zap, title: 'AI assistance', text: 'Call summaries, lead scoring, and follow-up suggestions to help sales teams act faster.' },
  { icon: KeyRound, title: 'Two-factor sign-in', text: 'Optional second step at sign-in for accounts that need stronger protection.' },
]

const FAQS = [
  { q: 'Can I try NexaCRM now?', a: 'The frontend is live and the API is built. Public backend hosting is still in progress, so the live site needs the backend connected before data loads.' },
  { q: 'How do roles work?', a: 'Every user has one of four roles. The API checks the role on each protected request, so the rules apply even if someone calls the API directly.' },
  { q: 'Where is my data stored?', a: 'In PostgreSQL. Every record belongs to an organization, and queries are filtered by that organization.' },
  { q: 'Can I run it myself?', a: 'Yes. Clone the repository, install the dependencies, and point the server at your own PostgreSQL database. A Render blueprint is included for hosting the API.' },
  { q: 'Is it open source?', a: 'Yes, under the ISC license. The source code and setup instructions are on GitHub.' },
  { q: 'What is still on the roadmap?', a: 'Call management, support tickets, workflow automation, AI assistance, and two-factor sign-in. They are listed in the roadmap section and are not available yet.' },
]

/* ---------- small pieces ---------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{children}</p>
}

function SampleTag() {
  return <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium tracking-wide text-text-muted uppercase">Sample data</span>
}

function MenuItemBody({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="block text-sm font-semibold">{item.label}</span>
      <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{item.description}</span>
    </>
  )
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

function NavDropdown({ label, items, onSelect, activeId }: { label: string; items: MenuItem[]; onSelect: (id: string) => void; activeId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasActive = items.some((item) => item.id === activeId)

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
        className={`relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface-muted hover:text-text-primary ${
          hasActive ? 'text-text-primary' : 'text-text-secondary'
        }`}
      >
        {label}
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
        {hasActive && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
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

function HeroDashboard() {
  const bars = [40, 55, 48, 70, 62, 85, 78]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const kpis = [
    { label: 'Open pipeline', value: 'USD 195k' },
    { label: 'Active deals', value: '24' },
    { label: 'New leads', value: '61' },
    { label: 'Win rate', value: '38%' },
  ]
  return (
    <div className="relative mx-auto mt-16 max-w-5xl" aria-hidden>
      <div className="landing-glow pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/25 via-info/15 to-success/15 blur-3xl" />
      <div className="landing-float rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">N</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </div>
          <SampleTag />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl bg-surface-muted p-3">
              <p className="text-[11px] text-text-muted">{kpi.label}</p>
              <p className="mt-1 text-base font-semibold">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div className="rounded-xl border border-border p-4 md:col-span-3">
            <p className="text-xs font-medium text-text-secondary">Revenue, last 7 months</p>
            <div className="mt-4 flex h-32 items-end gap-2 sm:gap-3">
              {bars.map((height, i) => (
                <div key={months[i]} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="landing-bar w-full rounded-t-md bg-gradient-to-t from-primary to-info" style={{ height: `${height}%`, transitionDelay: `${i * 90}ms` }} />
                  <span className="text-[10px] text-text-muted">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 md:col-span-2">
            <p className="text-xs font-medium text-text-secondary">Recent activity</p>
            <ul className="mt-3 space-y-3">
              {[
                { who: 'Maya Iyer', what: 'Moved Harborview Health to Won' },
                { who: 'James Cooper', what: 'Logged a meeting with Redwood Capital' },
                { who: 'Sarah Mitchell', what: 'Created a task for Atlas Construction' },
              ].map((item) => (
                <li key={item.who} className="text-xs">
                  <p className="font-semibold text-text-primary">{item.who}</p>
                  <p className="text-text-muted">{item.what}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="landing-float-slow absolute -right-3 -bottom-6 hidden items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-xl sm:flex">
        <span className="landing-pulse size-2.5 rounded-full bg-success" />
        <p className="text-sm font-medium">Deal moved to Won</p>
      </div>
    </div>
  )
}

function FaqItem({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="border-b border-border last:border-0">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          {q}
          <Plus className={`size-5 shrink-0 text-text-muted transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden />
        </button>
      </h3>
      <div className="landing-accordion" data-open={open} id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`}>
        <div>
          <p className="pb-5 pr-10 text-sm leading-relaxed text-text-secondary">{a}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export function LandingPage() {
  const { scrolled, progress } = useScrollState()
  const activeId = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Stop the page behind the mobile menu from scrolling.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
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
            <NavDropdown label="Product" items={PRODUCT_MENU} onSelect={navigateTo} activeId={activeId} />
            <NavDropdown label="Resources" items={RESOURCES_MENU} onSelect={navigateTo} activeId={activeId} />
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden h-9 items-center rounded-md px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-white shadow-md shadow-primary/25 transition hover:-translate-y-px hover:opacity-95 active:scale-[0.98]">
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
          <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-border bg-background md:hidden">
            <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4">
              {[{ title: 'Product', items: PRODUCT_MENU }, { title: 'Resources', items: RESOURCES_MENU }].map((group) => (
                <div key={group.title} className="mb-4">
                  <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-text-muted uppercase">{group.title}</p>
                  {group.items.map((item) => (
                    <NavItemLink key={item.label} item={item} onSelect={navigateTo} className="block w-full rounded-md px-3 py-2.5 text-left hover:bg-surface-muted" />
                  ))}
                </div>
              ))}
              <div className="grid gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-md border border-border px-3 py-3 text-center text-sm font-medium">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-md bg-primary px-3 py-3 text-center text-sm font-medium text-white">
                  Get started
                </Link>
              </div>
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
                <Zap className="size-3.5 text-warning" aria-hidden /> The modern customer platform
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-balance text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Turn every customer interaction into a{' '}
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">better business outcome</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
                NexaCRM manages leads, companies, contacts, deals, and tasks from one workspace, with role-based access enforced by the server.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/register" className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98]">
                  Get started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <Link to="/login" className="inline-flex h-12 items-center rounded-lg border border-border bg-surface px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-surface-muted active:scale-[0.98]">
                  Sign in to workspace
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={320}>
            <HeroDashboard />
          </Reveal>
        </section>

        {/* Tech strip */}
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

        {/* Modules */}
        <section id="features" className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-24">
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

        {/* Customer 360 */}
        <section id="customer" className="scroll-mt-20 border-y border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Customer 360°</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One customer. One complete view.</h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                Open a company or contact and see its people, deals, tasks, and activity history together, so you know the full story before you reply.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                {['Company and contact details in one place', 'Deals and tasks linked to each account', 'Activity timeline of calls, emails, and meetings'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-xl shadow-black/5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Harborview Health</p>
                    <p className="text-xs text-text-muted">Healthcare · Customer since Q2</p>
                  </div>
                  <SampleTag />
                </div>
                <ol className="mt-6 space-y-4 border-l border-border pl-5">
                  {TIMELINE.map((item, i) => (
                    <li key={item.text} className="relative">
                      <span aria-hidden className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-primary" />
                      <p className="text-xs font-semibold text-primary">{item.kind} · <span className="font-normal text-text-muted">{item.when}</span></p>
                      <p className="mt-1 text-sm">{item.text}</p>
                      <span className="sr-only">{i + 1}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pipeline */}
        <section id="pipeline" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Sales pipeline</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Visualize your pipeline. Close more deals.</h2>
                <p className="mt-3 max-w-xl text-text-secondary">Follow every deal from new to won or lost on one board, with its value and owner visible at a glance.</p>
              </div>
              <SampleTag />
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-6">
                {PIPELINE.map((column) => (
                  <div key={column.stage} className="min-w-[200px] rounded-xl border border-border bg-surface-muted/50 p-3 md:min-w-0">
                    <div className="mb-3 flex items-center gap-2">
                      <span aria-hidden className={`size-2 rounded-full ${column.tone}`} />
                      <p className="text-xs font-semibold">{column.stage}</p>
                      <span className="ml-auto text-[11px] text-text-muted">{column.cards.length}</span>
                    </div>
                    <div className="space-y-2.5">
                      {column.cards.map((card) => (
                        <article key={card.company} className="rounded-lg border border-border bg-surface p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                          <p className="truncate text-xs font-semibold">{card.company}</p>
                          <p className="mt-1.5 text-xs text-primary">{card.value}</p>
                          <p className="mt-1 text-[11px] text-text-muted">Owner: {card.owner}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="scroll-mt-20 border-t border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Security & roles</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Access you can trust, enforced on the server</h2>
              <p className="mt-4 text-text-secondary">Hiding a button is never the only safeguard. The API checks permissions on every protected request.</p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {SECURITY_POINTS.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={(i % 2) * 100}>
                  <article className="flex h-full gap-4 rounded-xl border border-border bg-surface p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-10">
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <caption className="px-5 pt-4 pb-2 text-left text-xs text-text-muted">What each role can do, matching the server permission map.</caption>
                  <thead>
                    <tr className="border-b border-border bg-surface-muted/60">
                      <th scope="col" className="px-5 py-3.5 font-semibold">Area</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Admin</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Manager</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Sales agent</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES_MATRIX.map((row) => (
                      <tr key={row.area} className="border-b border-border last:border-0 transition-colors hover:bg-surface-muted/40">
                        <th scope="row" className="px-5 py-3.5 font-medium">{row.area}</th>
                        <td className="px-5 py-3.5">{row.admin}</td>
                        <td className="px-5 py-3.5">{row.manager}</td>
                        <td className="px-5 py-3.5">{row.agent}</td>
                        <td className="px-5 py-3.5">{row.viewer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={160} className="mt-14">
              <div className="grid gap-5 sm:grid-cols-3">
                {PLATFORM_LAYERS.map(({ icon: Icon, title, items }) => (
                  <div key={title} className="rounded-xl border border-border bg-surface p-5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 text-primary" aria-hidden />
                      <h3 className="text-sm font-semibold">{title}</h3>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="text-xs text-text-secondary">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Roadmap</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What we are building next</h2>
              <p className="mt-4 text-text-secondary">These are planned and not yet available in the current release.</p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ROADMAP.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={(i % 3) * 90}>
                  <article className="flex h-full flex-col rounded-xl border border-dashed border-border bg-surface p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">Planned</span>
                    </div>
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Lifecycle */}
        <section className="border-y border-border bg-surface-muted/40 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>The customer journey</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From first enquiry to a closed deal</h2>
            </Reveal>
            <ol className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-6">
              <span aria-hidden className="absolute top-5 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
              {[
                { n: '01', title: 'Capture', text: 'A new enquiry becomes a lead in seconds, with an owner assigned.' },
                { n: '02', title: 'Connect', text: 'Link the lead to its company and contacts in one record.' },
                { n: '03', title: 'Progress', text: 'Turn qualified leads into deals and move them through the pipeline.' },
                { n: '04', title: 'Review', text: 'Use the dashboard to see where revenue is moving and where to focus.' },
              ].map((step, i) => (
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

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
              <p className="mt-4 text-text-secondary">Still unsure? Read the source code or sign in and explore the workspace.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-xl border border-border bg-surface px-5 sm:px-6">
                {FAQS.map((item, i) => (
                  <FaqItem
                    key={item.q}
                    id={`faq-${i}`}
                    q={item.q}
                    a={item.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-24">
          <Reveal className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-xl shadow-black/5 sm:px-12">
              <div aria-hidden className="landing-glow pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative">
                <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                  <LayoutDashboard className="size-6" aria-hidden />
                </span>
                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Ready to run your pipeline in one place?</h2>
                <p className="mx-auto mt-4 max-w-xl text-text-secondary">Create an account and bring your leads, companies, and deals into one workspace.</p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/register" className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98]">
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-text-muted">A full-stack CRM for customer-focused sales teams.</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Product</p>
            <ul className="mt-4 space-y-2.5 text-text-muted">
              <li><button type="button" onClick={() => scrollToSection('features')} className="transition-colors hover:text-text-primary">Modules</button></li>
              <li><button type="button" onClick={() => scrollToSection('security')} className="transition-colors hover:text-text-primary">Security & roles</button></li>
              <li><button type="button" onClick={() => scrollToSection('roadmap')} className="transition-colors hover:text-text-primary">Roadmap</button></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Account</p>
            <ul className="mt-4 space-y-2.5 text-text-muted">
              <li><Link to="/login" className="transition-colors hover:text-text-primary">Sign in</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-text-primary">Create account</Link></li>
              <li><a href="https://github.com/rahulchaurasiya722003/saas-crm" target="_blank" rel="noreferrer" className="transition-colors hover:text-text-primary">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-text-muted sm:px-6">© {CURRENT_YEAR} NexaCRM. Released under the ISC license.</p>
        </div>
      </footer>
    </div>
  )
}
