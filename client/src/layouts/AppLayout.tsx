import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CommandPalette } from '../components/layout/CommandPalette'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Skeleton } from '../components/ui/Skeleton'

const COLLAPSED_KEY = 'nexacrm-sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      } else if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeMobile])

  const toggleCollapsed = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, c ? '0' : '1')
      } catch {
        // ignore
      }
      return !c
    })

  return (
    <div className="flex h-dvh overflow-hidden">
      <a href="#main" className="sr-only z-[70] rounded-md bg-primary px-3 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} mobileOpen={mobileOpen} onCloseMobile={closeMobile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto">
          <div key={pathname} className="mx-auto w-full max-w-[1400px] animate-[fade-in_200ms_ease-out] p-4 md:p-6">
            <Suspense fallback={<Skeleton className="h-64" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
