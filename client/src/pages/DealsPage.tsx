import { Briefcase } from 'lucide-react'
import { DataTable, type Column } from '../components/common/DataTable'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { formatCurrency, formatDate, fullName, titleCase } from '../lib/format'
import { getDeals } from '../services/crm.service'
import type { Deal, DealStage } from '../types'

const STAGES: DealStage[] = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']

const columns: Column<Deal>[] = [
  { key: 'name', header: 'Deal', cell: (d) => <span className="font-medium">{d.name}</span> },
  { key: 'company', header: 'Company', cell: (d) => d.company?.name ?? '—' },
  { key: 'value', header: 'Value', cell: (d) => <span className="whitespace-nowrap font-medium">{formatCurrency(Number(d.value))}</span> },
  { key: 'stage', header: 'Stage', cell: (d) => <StatusBadge value={d.stage} /> },
  {
    key: 'probability',
    header: 'Probability',
    cell: (d) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${d.probability}%` }} />
        </div>
        <span className="text-xs text-text-secondary">{d.probability}%</span>
      </div>
    ),
  },
  {
    key: 'close',
    header: 'Expected close',
    cell: (d) => <span className="whitespace-nowrap text-text-secondary">{d.expectedCloseDate ? formatDate(d.expectedCloseDate) : '—'}</span>,
  },
  { key: 'owner', header: 'Owner', cell: (d) => fullName(d.owner) },
]

export function DealsPage() {
  const s = useListState('deals', getDeals)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query

  return (
    <>
      <PageHeader title="Deals" description="Track every opportunity from first touch to close." />
      <Card className="overflow-hidden">
        <ListToolbar
          search={s.search}
          onSearch={s.setSearch}
          placeholder="Search deals..."
          status={{
            label: 'All stages',
            value: s.status,
            onChange: s.setStatus,
            options: STAGES.map((v) => ({ value: v, label: titleCase(v) })),
          }}
        />
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            caption="Deals"
            columns={columns}
            rows={data?.items}
            rowKey={(d) => d.id}
            loading={isPending}
            error={isError}
            onRetry={refetch}
            meta={data?.meta}
            onPageChange={s.setPage}
            onPageSizeChange={s.setPageSize}
            empty={
              <EmptyState
                icon={Briefcase}
                title={s.hasFilters ? 'No matching deals' : 'No deals yet'}
                description={s.hasFilters ? 'Try adjusting your search or filters.' : 'Create your first deal to start tracking revenue.'}
                action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear filters</Button> : undefined}
              />
            }
          />
        </div>
      </Card>
    </>
  )
}
