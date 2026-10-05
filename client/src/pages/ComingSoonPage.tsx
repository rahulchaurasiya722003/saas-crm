import { Hammer } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ROUTE_LABELS } from '../components/layout/nav'
import { EmptyState } from '../components/ui/States'

export function ComingSoonPage() {
  const { pathname } = useLocation()
  const label = ROUTE_LABELS[pathname] ?? pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'This page'
  return (
    <EmptyState
      icon={Hammer}
      title={`${label} is not built yet`}
      description="This section is planned for an upcoming development phase."
    />
  )
}
