import { Activity, ArrowRightLeft, CheckSquare, ChevronLeft, ChevronRight, Mail, Phone, StickyNote, Users, type LucideIcon } from 'lucide-react'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { fullName, relativeTime, titleCase } from '../lib/format'
import { getActivities } from '../services/crm.service'
import type { ActivityItem, ActivityType } from '../types'

const TYPES: ActivityType[] = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK', 'STATUS_CHANGE']

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  NOTE: StickyNote,
  TASK: CheckSquare,
  STATUS_CHANGE: ArrowRightLeft,
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = TYPE_ICON[item.type] ?? Activity
  return (
    <li className="flex gap-3 p-4 animate-[fade-in_200ms_ease-out]">
      <span aria-hidden className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium">{item.title}</p>
          <StatusBadge value={item.type} />
        </div>
        {item.body && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{item.body}</p>}
        <p className="mt-1 text-xs text-text-muted">
          {item.user ? `${fullName(item.user)} · ` : ''}
          {relativeTime(item.occurredAt)}
        </p>
      </div>
    </li>
  )
}

const NAV_BTN =
  'flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface-muted active:scale-95 disabled:opacity-40 disabled:active:scale-100'

export function ActivitiesPage() {
  const s = useListState('activities', getActivities)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query
  const meta = data?.meta

  return (
    <>
      <PageHeader title="Activities" description="A running log of calls, emails, meetings, and updates." />
      <Card className="overflow-hidden">
        <ListToolbar
          search={s.search}
          onSearch={s.setSearch}
          placeholder="Search activities..."
          status={{
            label: 'All types',
            value: s.status,
            onChange: s.setStatus,
            options: TYPES.map((v) => ({ value: v, label: titleCase(v) })),
          }}
        />
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : isPending ? (
          <ul className="divide-y divide-border">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="flex gap-3 p-4">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56 max-w-full" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </li>
            ))}
          </ul>
        ) : data?.items.length === 0 ? (
          <EmptyState
            icon={Activity}
            title={s.hasFilters ? 'No matching activities' : 'No activity yet'}
            description={s.hasFilters ? 'Try adjusting your search or filters.' : 'Team activity will appear here as work happens.'}
            action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear filters</Button> : undefined}
          />
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ul className="divide-y divide-border" aria-label="Activities">
              {data?.items.map((item) => <ActivityRow key={item.id} item={item} />)}
            </ul>
            {meta && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary">
                <span aria-live="polite">
                  Page {meta.page} of {meta.totalPages}
                  <span className="hidden sm:inline"> · {meta.total} total</span>
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => s.setPage(meta.page - 1)} disabled={meta.page <= 1} aria-label="Previous page" className={NAV_BTN}>
                    <ChevronLeft className="size-4" />
                  </button>
                  <button onClick={() => s.setPage(meta.page + 1)} disabled={meta.page >= meta.totalPages} aria-label="Next page" className={NAV_BTN}>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  )
}
