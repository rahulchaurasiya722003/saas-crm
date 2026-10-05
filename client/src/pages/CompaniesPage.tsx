import { Building2 } from 'lucide-react'
import { DataTable, type Column } from '../components/common/DataTable'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { formatDate, fullName } from '../lib/format'
import { getCompanies } from '../services/crm.service'
import type { Company } from '../types'

const columns: Column<Company>[] = [
  { key: 'name', header: 'Company', cell: (c) => <span className="font-medium">{c.name}</span> },
  { key: 'industry', header: 'Industry', cell: (c) => c.industry ?? '—' },
  { key: 'location', header: 'Location', cell: (c) => [c.city, c.country].filter(Boolean).join(', ') || '—' },
  { key: 'contacts', header: 'Contacts', cell: (c) => c._count.contacts, className: 'text-right' },
  { key: 'deals', header: 'Deals', cell: (c) => c._count.deals, className: 'text-right' },
  { key: 'owner', header: 'Owner', cell: (c) => fullName(c.owner) },
  { key: 'created', header: 'Created', cell: (c) => <span className="whitespace-nowrap text-text-secondary">{formatDate(c.createdAt)}</span> },
]

export function CompaniesPage() {
  const s = useListState('companies', getCompanies)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query

  return (
    <>
      <PageHeader title="Companies" description="Organizations you sell to and their related contacts and deals." />
      <Card className="overflow-hidden">
        <ListToolbar search={s.search} onSearch={s.setSearch} placeholder="Search companies..." />
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            caption="Companies"
            columns={columns}
            rows={data?.items}
            rowKey={(c) => c.id}
            loading={isPending}
            error={isError}
            onRetry={refetch}
            meta={data?.meta}
            onPageChange={s.setPage}
            onPageSizeChange={s.setPageSize}
            empty={
              <EmptyState
                icon={Building2}
                title={s.hasFilters ? 'No matching companies' : 'No companies yet'}
                description={s.hasFilters ? 'Try adjusting your search.' : 'Companies you add will appear here.'}
                action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear search</Button> : undefined}
              />
            }
          />
        </div>
      </Card>
    </>
  )
}
