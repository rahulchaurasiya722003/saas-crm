import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NAV_GROUPS } from './nav'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
        N
      </span>
      {!collapsed && <span className="text-[15px] font-semibold tracking-tight">NexaCRM</span>}
    </div>
  )
}

function NavContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 pb-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mt-4 first:mt-0">
          <p className={`px-2.5 pb-1 text-[11px] font-medium tracking-wider text-text-muted uppercase ${collapsed ? 'sr-only' : ''}`}>
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onNavigate}
                  aria-label={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `group relative flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary ${
                      isActive ? 'bg-primary/10 font-medium text-primary' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                    }`
                  }
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full z-50 ml-2 rounded-md bg-text-primary px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet */}
      <aside
        className={`hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 md:flex ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="flex h-14 items-center justify-between px-3">
          <Brand collapsed={collapsed} />
          {!collapsed && (
            <button onClick={onToggleCollapsed} aria-label="Collapse sidebar" className="rounded-md p-1.5 text-text-muted hover:bg-surface-muted">
              <PanelLeftClose className="size-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button onClick={onToggleCollapsed} aria-label="Expand sidebar" className="mx-auto mb-2 rounded-md p-1.5 text-text-muted hover:bg-surface-muted">
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        <NavContent collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} inert={!mobileOpen}>
        <div
          onClick={onCloseMobile}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex h-14 items-center justify-between px-3">
            <Brand collapsed={false} />
            <button onClick={onCloseMobile} aria-label="Close menu" className="rounded-md p-1.5 text-text-muted hover:bg-surface-muted">
              <X className="size-4" />
            </button>
          </div>
          <NavContent collapsed={false} onNavigate={onCloseMobile} />
        </aside>
      </div>
    </>
  )
}
