import { CheckSquare } from 'lucide-react'
import { Avatar } from '../components/common/Avatar'
import { DataTable, type Column } from '../components/common/DataTable'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { formatDate, fullName, isOverdue, titleCase } from '../lib/format'
import { getTasks } from '../services/crm.service'
import type { Task, TaskStatus } from '../types'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED']

function DueDate({ task }: { task: Task }) {
  if (!task.dueDate) return <span className="text-text-secondary">—</span>
  const overdue = task.status !== 'COMPLETED' && isOverdue(task.dueDate)
  return (
    <span className={`whitespace-nowrap ${overdue ? 'font-medium text-danger' : 'text-text-secondary'}`}>
      {formatDate(task.dueDate)}
      {overdue && <span className="ml-1 text-xs">(overdue)</span>}
    </span>
  )
}

const columns: Column<Task>[] = [
  {
    key: 'title',
    header: 'Task',
    cell: (t) => (
      <div className="min-w-0">
        <p className="font-medium">{t.title}</p>
        {t.description && <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">{t.description}</p>}
      </div>
    ),
  },
  { key: 'status', header: 'Status', cell: (t) => <StatusBadge value={t.status} /> },
  { key: 'priority', header: 'Priority', cell: (t) => <StatusBadge value={t.priority} /> },
  { key: 'due', header: 'Due', cell: (t) => <DueDate task={t} /> },
  {
    key: 'assignee',
    header: 'Assignee',
    cell: (t) =>
      t.assignee ? (
        <div className="flex items-center gap-2">
          <Avatar person={t.assignee} size="sm" />
          <span className="whitespace-nowrap">{fullName(t.assignee)}</span>
        </div>
      ) : (
        'Unassigned'
      ),
  },
  { key: 'created', header: 'Created', cell: (t) => <span className="whitespace-nowrap text-text-secondary">{formatDate(t.createdAt)}</span> },
]

export function TasksPage() {
  const s = useListState('tasks', getTasks)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query

  return (
    <>
      <PageHeader title="Tasks" description="Stay on top of follow-ups and to-dos across your team." />
      <Card className="overflow-hidden">
        <ListToolbar
          search={s.search}
          onSearch={s.setSearch}
          placeholder="Search tasks..."
          status={{
            label: 'All statuses',
            value: s.status,
            onChange: s.setStatus,
            options: STATUSES.map((v) => ({ value: v, label: titleCase(v) })),
          }}
        />
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            caption="Tasks"
            columns={columns}
            rows={data?.items}
            rowKey={(t) => t.id}
            loading={isPending}
            error={isError}
            onRetry={refetch}
            meta={data?.meta}
            onPageChange={s.setPage}
            onPageSizeChange={s.setPageSize}
            empty={
              <EmptyState
                icon={CheckSquare}
                title={s.hasFilters ? 'No matching tasks' : 'No tasks yet'}
                description={s.hasFilters ? 'Try adjusting your search or filters.' : 'Tasks assigned to your team will show up here.'}
                action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear filters</Button> : undefined}
              />
            }
          />
        </div>
      </Card>
    </>
  )
}
