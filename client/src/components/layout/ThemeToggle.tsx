import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemePreference } from '../../store/theme'

const ORDER: ThemePreference[] = ['light', 'dark', 'system']
const ICONS = { light: Sun, dark: Moon, system: Monitor }
const LABELS = { light: 'Light', dark: 'Dark', system: 'System' }

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]!
  const Icon = ICONS[preference]
  return (
    <button
      onClick={() => setPreference(next)}
      aria-label={`Theme: ${LABELS[preference]}. Switch to ${LABELS[next]}`}
      title={`Theme: ${LABELS[preference]}`}
      className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary"
    >
      <Icon className="size-[18px]" />
    </button>
  )
}
