import { useQuery } from '@tanstack/react-query'
import { Columns3 } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../components/ui/States'
import { formatCompactCurrency, formatCurrency, formatDate, fullName, initials, titleCase } from '../lib/format'
import { getPipeline } from '../services/crm.service'
import type { Deal, DealStage, PipelineStage } from '../types'

const STAGE_ACCENT: Record<DealStage, string> = {
  NEW: 'bg-info',
  QUALIFIED: 'bg-primary',
  PROPOSAL: 'bg-warning',
  NEGOTIATION: 'bg-warning',
  WON: 'bg-success',
  LOST: 'bg-danger',
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <li className="rounded-md border border-border bg-surface p-3 text-sm shadow-xs transition-shadow hover:shadow-sm">
      <p className="font-medium leading-snug">{deal.name}</p>
      {deal.company && <p className="mt-0.5 truncate text-xs text-text-secondary">{deal.company.name}</p>}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="font-semibold">{formatCurrency(Number(deal.value))}</span>
        {deal.owner && (
          <span
            title={fullName(deal.owner)}
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
          >
            {initials(deal.owner)}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-text-muted">
        <span>{deal.probability}% likely</span>
        {deal.expectedCloseDate && <span className="whitespace-nowrap">{formatDate(deal.expectedCloseDate)}</span>}
      </div>
    </li>
  )
}

function StageColumn({ stage }: { stage: PipelineStage }) {
  return (
    <section
      aria-label={`${titleCase(stage.stage)} deals`}
      className="flex w-[280px] shrink-0 snap-start flex-col rounded-lg bg-surface-muted/60 lg:w-auto lg:min-w-0 lg:flex-1"
    >
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span aria-hidden className={`size-2 shrink-0 rounded-full ${STAGE_ACCENT[stage.stage]}`} />
        <h2 className="truncate text-sm font-semibold">{titleCase(stage.stage)}</h2>
        <span className="rounded-full bg-surface px-1.5 py-0.5 text-xs text-text-secondary">{stage.count}</span>
        <span className="ml-auto whitespace-nowrap text-xs text-text-muted">{formatCompactCurrency(stage.totalValue)}</span>
      </header>
      <ul className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {stage.deals.length === 0 ? (
          <li className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-text-muted">No deals</li>
        ) : (
          stage.deals.map((d) => <DealCard key={d.id} deal={d} />)
        )}
      </ul>
    </section>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="hidden w-full space-y-2 rounded-lg bg-surface-muted/60 p-3 first:block sm:block">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ))}
    </div>
  )
}

export function PipelinePage() {
  const { data, isPending, isError, refetch } = useQuery({ queryKey: ['pipeline'], queryFn: getPipeline })

  const isEmpty = data && data.stages.every((s) => s.count === 0)

  return (
    <>
      <PageHeader title="Pipeline" description="A stage-by-stage view of every open opportunity." />
      {isError ? (
        <Card>
          <ErrorState onRetry={refetch} />
        </Card>
      ) : isPending ? (
        <BoardSkeleton />
      ) : isEmpty ? (
        <Card>
          <EmptyState icon={Columns3} title="No deals in the pipeline" description="Deals will appear here grouped by stage as soon as you create them." />
        </Card>
      ) : (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:snap-none" style={{ minHeight: 'calc(100dvh - 14rem)' }}>
          {data?.stages.map((stage) => <StageColumn key={stage.stage} stage={stage} />)}
        </div>
      )}
    </>
  )
}
