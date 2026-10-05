import { Moon, Sun, type LucideIcon } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { useTheme, type ResolvedTheme } from '../store/theme'

const OPTIONS: { value: ResolvedTheme; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Day', description: 'Bright, light background.', icon: Sun },
  { value: 'dark', label: 'Night', description: 'Dark background, easier on the eyes at night.', icon: Moon },
]

export function PreferencesPage() {
  const { preference, resolved, setPreference } = useTheme()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  // Until the user picks a mode, the theme follows the device setting.
  const followsDevice = preference === 'system'

  // Arrow keys move between the two options, as in a native radio group.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const next = (index + 1) % OPTIONS.length
    setPreference(OPTIONS[next]!.value)
    buttons.current[next]?.focus()
  }

  const currentLabel = resolved === 'dark' ? 'Night' : 'Day'
  const status = followsDevice
    ? `Following your device setting: ${currentLabel} Mode. It changes automatically when your device changes.`
    : `Set manually to ${currentLabel} Mode.`

  return (
    <div>
      <PageHeader title="Preferences" description="Personalize how NexaCRM looks on this device." />

      <section aria-labelledby="appearance-heading" className="max-w-2xl rounded-lg border border-border bg-surface p-5 sm:p-6">
        <h2 id="appearance-heading" className="text-sm font-semibold">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-text-secondary">Choose Day or Night. Until you choose, NexaCRM matches your device.</p>

        <div role="radiogroup" aria-labelledby="appearance-heading" className="mt-5 grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((option, index) => {
            const selected = resolved === option.value
            const Icon = option.icon
            return (
              <button
                key={option.value}
                ref={(el) => {
                  buttons.current[index] = el
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setPreference(option.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  selected
                    ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                    : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-muted'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={`flex size-9 items-center justify-center rounded-md transition-colors ${selected ? 'bg-primary text-white' : 'bg-surface-muted text-text-secondary'}`}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className={`flex size-4 items-center justify-center rounded-full border transition-colors ${selected ? 'border-primary' : 'border-border'}`}
                  >
                    {selected && <span className="size-2 rounded-full bg-primary" />}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{option.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-4 text-xs text-text-muted">
          {status}
        </p>
      </section>
    </div>
  )
}
