import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'

interface KpiCardProps {
  label: string
  icon: LucideIcon
  value?: string
  change?: number
  /** Omit when the metric has no period-over-period comparison. */
  comparison?: string
}

export function KpiCard({ label, icon: Icon, value, change, comparison }: KpiCardProps) {
  const positive = (change ?? 0) >= 0
  const Trend = positive ? TrendingUp : TrendingDown
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      {value === undefined ? (
        <Skeleton className="mt-3 h-7 w-24" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      )}
      {comparison && change !== undefined && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
          <span className={`inline-flex items-center gap-0.5 font-medium ${positive ? 'text-success' : 'text-danger'}`}>
            <Trend className="size-3" aria-hidden />
            {positive ? '+' : ''}
            {change}%
          </span>
          {comparison}
        </p>
      )}
    </Card>
  )
}
