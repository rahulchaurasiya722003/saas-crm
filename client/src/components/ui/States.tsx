import { AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-surface-muted text-text-muted">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center" role="alert">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold">Something went wrong.</h3>
      <p className="mt-1 text-sm text-text-secondary">Please try again.</p>
      <Button variant="secondary" className="mt-4" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
