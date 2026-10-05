import { Building2, LogOut, SlidersHorizontal, UserCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDismiss } from '../../hooks/useDismiss'
import { fullName, titleCase } from '../../lib/format'
import { useAuth } from '../../store/auth'
import { Avatar } from '../common/Avatar'

const ITEMS = [
  { label: 'Profile', to: '/settings/profile', icon: UserCircle },
  { label: 'Preferences', to: '/settings/preferences', icon: SlidersHorizontal },
  { label: 'Organization', to: '/settings/organization', icon: Building2 },
]

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  if (!user) return null

  const signOut = async () => {
    close()
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex size-9 items-center justify-center rounded-md hover:bg-surface-muted"
      >
        <Avatar person={user} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 animate-[pop-in_150ms_ease-out] rounded-lg border border-border bg-surface py-1 shadow-lg">
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-sm font-medium">{fullName(user)}</p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
            <p className="mt-1 text-xs text-text-secondary">{titleCase(user.role)}</p>
          </div>
          {ITEMS.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} onClick={close} className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary">
              <Icon className="size-4" aria-hidden /> {label}
            </Link>
          ))}
          <button onClick={signOut} className="flex w-full items-center gap-2.5 border-t border-border px-3 py-2 text-sm text-danger hover:bg-surface-muted">
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
