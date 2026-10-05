import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { GuestRoute, HomeRoute, ProtectedRoute } from './routes/ProtectedRoute'
import { AuthProvider } from './store/auth'
import { ThemeProvider } from './store/theme'
import { ToastProvider } from './store/toast'

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LeadsPage = lazy(() => import('./pages/LeadsPage').then((m) => ({ default: m.LeadsPage })))
const CompaniesPage = lazy(() => import('./pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })))
const ContactsPage = lazy(() => import('./pages/ContactsPage').then((m) => ({ default: m.ContactsPage })))
const DealsPage = lazy(() => import('./pages/DealsPage').then((m) => ({ default: m.DealsPage })))
const PipelinePage = lazy(() => import('./pages/PipelinePage').then((m) => ({ default: m.PipelinePage })))
const TasksPage = lazy(() => import('./pages/TasksPage').then((m) => ({ default: m.TasksPage })))
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage').then((m) => ({ default: m.ActivitiesPage })))
const PreferencesPage = lazy(() => import('./pages/PreferencesPage').then((m) => ({ default: m.PreferencesPage })))
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<HomeRoute landing={<LandingPage />} />} />
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="companies" element={<CompaniesPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="deals" element={<DealsPage />} />
                    <Route path="pipeline" element={<PipelinePage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="activities" element={<ActivitiesPage />} />
                    <Route path="settings/preferences" element={<PreferencesPage />} />
                    <Route path="*" element={<ComingSoonPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
