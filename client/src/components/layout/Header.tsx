import { ChevronRight, Menu, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { NotificationsMenu } from './NotificationsMenu'
import { ROUTE_LABELS } from './nav'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  onOpenMenu: () => void
  onOpenSearch: () => void
}

function Breadcrumb() {
  const { pathname } = useLocation()
  const label = ROUTE_LABELS[pathname] ?? 'NexaCRM'
  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm lg:flex">
      <Link to="/" className="text-text-muted hover:text-text-primary">
        NexaCRM
      </Link>
      {pathname !== '/' && (
        <>
          <ChevronRight className="size-3.5 text-text-muted" aria-hidden />
          <span aria-current="page" className="font-medium">
            {label}
          </span>
        </>
      )}
    </nav>
  )
}

export function Header({ onOpenMenu, onOpenSearch }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <button onClick={onOpenMenu} aria-label="Open menu" className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted md:hidden">
        <Menu className="size-5" />
      </button>
      <div className="min-w-0 lg:flex-1">
        <Breadcrumb />
      </div>

      <button
        onClick={onOpenSearch}
        aria-label="Search (Ctrl+K)"
        className="hidden h-9 w-full max-w-sm items-center gap-2 rounded-md border border-border bg-surface-muted px-3 text-sm text-text-muted hover:border-text-muted md:flex"
      >
        <Search className="size-4" aria-hidden />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[11px]">Ctrl K</kbd>
      </button>

      <div className="flex flex-1 items-center justify-end gap-1">
        <button onClick={onOpenSearch} aria-label="Search" className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted md:hidden">
          <Search className="size-[18px]" />
        </button>
        <NotificationsMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
