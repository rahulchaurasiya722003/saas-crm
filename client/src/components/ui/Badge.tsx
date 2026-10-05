import { titleCase } from '../../lib/format'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-muted text-text-secondary',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

const STATUS_TONE: Record<string, Tone> = {
  NEW: 'info',
  CONTACTED: 'primary',
  QUALIFIED: 'warning',
  UNQUALIFIED: 'neutral',
  CONVERTED: 'success',
  PROPOSAL: 'primary',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'danger',
  LOW: 'neutral',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
  TODO: 'neutral',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CALL: 'primary',
  EMAIL: 'info',
  MEETING: 'warning',
  NOTE: 'neutral',
  TASK: 'success',
  STATUS_CHANGE: 'neutral',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{titleCase(value)}</Badge>
}
