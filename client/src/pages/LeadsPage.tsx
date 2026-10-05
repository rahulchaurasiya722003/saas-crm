import { Target } from 'lucide-react'
import { Avatar } from '../components/common/Avatar'
import { DataTable, type Column } from '../components/common/DataTable'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { formatDate, fullName, titleCase } from '../lib/format'
import { getLeads } from '../services/crm.service'
import type { Lead, LeadStatus } from '../types'

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED']

const columns: Column<Lead>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (l) => (
      <div className="flex items-center gap-2.5">
        <Avatar person={l} size="sm" />
        <span className="font-medium">{fullName(l)}</span>
      </div>
    ),
  },
  { key: 'company', header: 'Company', cell: (l) => l.company?.name ?? '—' },
  { key: 'email', header: 'Email', cell: (l) => <span className="text-text-secondary">{l.email ?? '—'}</span> },
  { key: 'phone', header: 'Phone', cell: (l) => <span className="whitespace-nowrap text-text-secondary">{l.phone ?? '—'}</span> },
  { key: 'source', header: 'Source', cell: (l) => l.source ?? '—' },
  { key: 'status', header: 'Status', cell: (l) => <StatusBadge value={l.status} /> },
  { key: 'owner', header: 'Owner', cell: (l) => fullName(l.owner) },
  { key: 'created', header: 'Created', cell: (l) => <span className="whitespace-nowrap text-text-secondary">{formatDate(l.createdAt)}</span> },
]

export function LeadsPage() {
  const s = useListState('leads', getLeads)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query

  return (
    <>
      <PageHeader title="Leads" description="Manage and track your potential customers." />
      <Card className="overflow-hidden">
        <ListToolbar
          search={s.search}
          onSearch={s.setSearch}
          placeholder="Search leads..."
          status={{
            label: 'All statuses',
            value: s.status,
            onChange: s.setStatus,
            options: STATUSES.map((v) => ({ value: v, label: titleCase(v) })),
          }}
        />
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            caption="Leads"
            columns={columns}
            rows={data?.items}
            rowKey={(l) => l.id}
            loading={isPending}
            error={isError}
            onRetry={refetch}
            meta={data?.meta}
            onPageChange={s.setPage}
            onPageSizeChange={s.setPageSize}
            empty={
              <EmptyState
                icon={Target}
                title={s.hasFilters ? 'No matching leads' : 'No leads yet'}
                description={s.hasFilters ? 'Try adjusting your search or filters.' : 'Start building your sales pipeline by adding your first lead.'}
                action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear filters</Button> : undefined}
              />
            }
          />
        </div>
      </Card>
    </>
  )
}
