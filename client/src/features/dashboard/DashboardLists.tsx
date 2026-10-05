import { Activity, Briefcase, CheckSquare, Trophy } from 'lucide-react'
import { Avatar } from '../../components/common/Avatar'
import { Card, CardHeader } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { formatCompactCurrency, formatCurrency, formatDate, fullName, isOverdue, relativeTime } from '../../lib/format'
import type { DashboardData } from '../../types'

function ListCard({ title, icon: Icon, empty, children, isEmpty }: {
  title: string
  icon: typeof Activity
  empty: string
  isEmpty: boolean
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader title={title} action={<Icon className="size-4 text-text-muted" aria-hidden />} />
      {isEmpty ? <p className="px-5 py-8 text-center text-sm text-text-secondary">{empty}</p> : <ul className="divide-y divide-border px-5 pt-2 pb-2">{children}</ul>}
    </Card>
  )
}

export function RecentActivities({ items }: { items: DashboardData['recentActivities'] }) {
  return (
    <ListCard title="Recent activities" icon={Activity} isEmpty={items.length === 0} empty="No activity yet.">
      {items.map((a) => (
        <li key={a.id} className="flex items-start justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm">{a.title}</p>
            <p className="text-xs text-text-muted">{a.user ? fullName(a.user) : 'System'}</p>
          </div>
          <span className="shrink-0 text-xs text-text-muted">{relativeTime(a.occurredAt)}</span>
        </li>
      ))}
    </ListCard>
  )
}

export function UpcomingTasks({ items }: { items: DashboardData['upcomingTasks'] }) {
  return (
    <ListCard title="Upcoming tasks" icon={CheckSquare} isEmpty={items.length === 0} empty="No open tasks. Nice work.">
      {items.map((t) => {
        const overdue = t.dueDate ? isOverdue(t.dueDate) : false
        return (
          <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm">{t.title}</p>
              <p className={`text-xs ${overdue ? 'text-danger' : 'text-text-muted'}`}>
                {t.dueDate ? `${overdue ? 'Overdue · ' : 'Due '}${formatDate(t.dueDate)}` : 'No due date'}
              </p>
            </div>
            <StatusBadge value={t.priority} />
          </li>
        )
      })}
    </ListCard>
  )
}

export function RecentDeals({ items }: { items: DashboardData['recentDeals'] }) {
  return (
    <ListCard title="Recent deals" icon={Briefcase} isEmpty={items.length === 0} empty="No deals yet.">
      {items.map((d) => (
        <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{d.name}</p>
            <p className="truncate text-xs text-text-muted">{d.company?.name ?? '—'} · {formatCurrency(d.value)}</p>
          </div>
          <StatusBadge value={d.stage} />
        </li>
      ))}
    </ListCard>
  )
}

export function TopReps({ items }: { items: DashboardData['topReps'] }) {
  return (
    <ListCard title="Top sales representatives" icon={Trophy} isEmpty={items.length === 0} empty="No closed deals yet.">
      {items.map((r, i) => {
        const [firstName = '', ...rest] = r.name.split(' ')
        return (
          <li key={r.id ?? i} className="flex items-center gap-3 py-2.5">
            <span className="w-4 text-xs text-text-muted">{i + 1}</span>
            <Avatar person={{ firstName, lastName: rest.join(' ') }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.name}</p>
              <p className="text-xs text-text-muted">{r.deals} won {r.deals === 1 ? 'deal' : 'deals'}</p>
            </div>
            <span className="text-sm font-medium">{formatCompactCurrency(r.revenue)}</span>
          </li>
        )
      })}
    </ListCard>
  )
}
