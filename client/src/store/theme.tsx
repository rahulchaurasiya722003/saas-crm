import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'nexacrm-theme'
const SWITCH_CLASS = 'theme-transition'
const SWITCH_DURATION_MS = 220

interface ThemeContextValue {
  preference: ThemePreference
  resolved: ResolvedTheme
  // Whether the OS/browser preference is currently dark. Only used when preference is 'system'.
  systemDark: boolean
  setPreference: (p: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const DARK_QUERY = '(prefers-color-scheme: dark)'
const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    // Storage can be blocked (private mode, disabled site data). Fall back to system.
  }
  return 'system'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStored)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const switchTimer = useRef<number | undefined>(undefined)

  // Keep following the OS/browser while the app is open.
  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY)
    const onChange = () => setSystemDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Explicit Light/Dark always wins. System defers to the OS/browser.
  const resolved: ResolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  useEffect(() => () => window.clearTimeout(switchTimer.current), [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      systemDark,
      setPreference: (next) => {
        if (next === preference) return
        // Briefly enable color transitions for this switch only, so page load and
        // system changes stay instant.
        const root = document.documentElement
        root.classList.add(SWITCH_CLASS)
        window.clearTimeout(switchTimer.current)
        switchTimer.current = window.setTimeout(() => root.classList.remove(SWITCH_CLASS), SWITCH_DURATION_MS)

        setPreferenceState(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // Saving is best-effort. The choice still applies for this session.
        }
      },
    }),
    [preference, resolved, systemDark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
