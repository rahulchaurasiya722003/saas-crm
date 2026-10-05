import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../store/theme'

// Two modes only. Until the user picks one, the theme follows the device or browser setting.
export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const isNight = resolved === 'dark'
  const Icon = isNight ? Moon : Sun
  const current = isNight ? 'Night' : 'Day'
  const next = isNight ? 'Day' : 'Night'

  return (
    <button
      type="button"
      onClick={() => setPreference(isNight ? 'light' : 'dark')}
      aria-label={`${current} mode. Switch to ${next} mode`}
      title={`${current} mode. Switch to ${next}`}
      className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  )
}
