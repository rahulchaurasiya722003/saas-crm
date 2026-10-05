import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Skeleton } from '../components/ui/Skeleton'
import { useAuth } from '../store/auth'

export function FullPageLoader() {
  return (
    <div className="flex h-screen items-center justify-center" role="status" aria-label="Loading">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  )
}

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <FullPageLoader />
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function GuestRoute() {
  const { status } = useAuth()
  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}

// Public home page: signed-in users skip straight to the dashboard.
export function HomeRoute({ landing }: { landing: React.ReactNode }) {
  const { status } = useAuth()
  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <>{landing}</>
}
