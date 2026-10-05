import { Users } from 'lucide-react'
import { Avatar } from '../components/common/Avatar'
import { DataTable, type Column } from '../components/common/DataTable'
import { ListToolbar } from '../components/common/ListToolbar'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/States'
import { useListState } from '../hooks/useListState'
import { formatDate, fullName } from '../lib/format'
import { getContacts } from '../services/crm.service'
import type { Contact } from '../types'

const columns: Column<Contact>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (c) => (
      <div className="flex items-center gap-2.5">
        <Avatar person={c} size="sm" />
        <span className="font-medium">{fullName(c)}</span>
      </div>
    ),
  },
  { key: 'company', header: 'Company', cell: (c) => c.company?.name ?? '—' },
  { key: 'email', header: 'Email', cell: (c) => <span className="text-text-secondary">{c.email ?? '—'}</span> },
  { key: 'phone', header: 'Phone', cell: (c) => <span className="whitespace-nowrap text-text-secondary">{c.phone ?? '—'}</span> },
  { key: 'title', header: 'Job title', cell: (c) => c.jobTitle ?? '—' },
  { key: 'owner', header: 'Owner', cell: (c) => fullName(c.owner) },
  { key: 'created', header: 'Added', cell: (c) => <span className="whitespace-nowrap text-text-secondary">{formatDate(c.createdAt)}</span> },
]

export function ContactsPage() {
  const s = useListState('contacts', getContacts)
  const { data, isPending, isError, isPlaceholderData, refetch } = s.query

  return (
    <>
      <PageHeader title="Contacts" description="People at the companies you work with." />
      <Card className="overflow-hidden">
        <ListToolbar search={s.search} onSearch={s.setSearch} placeholder="Search contacts..." />
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            caption="Contacts"
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
                icon={Users}
                title={s.hasFilters ? 'No matching contacts' : 'No contacts yet'}
                description={s.hasFilters ? 'Try adjusting your search.' : 'Contacts you add will appear here.'}
                action={s.hasFilters ? <Button variant="secondary" onClick={s.clearFilters}>Clear search</Button> : undefined}
              />
            }
          />
        </div>
      </Card>
    </>
  )
}
