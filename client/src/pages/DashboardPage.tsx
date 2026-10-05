import { useQuery } from '@tanstack/react-query'
import { Briefcase, DollarSign, Percent, Target, Wallet } from 'lucide-react'
import { ErrorState } from '../components/ui/States'
import { Skeleton } from '../components/ui/Skeleton'
import { Card } from '../components/ui/Card'
import { ChartSkeleton, DealPerformanceChart, LeadConversionChart, PipelineChart, RevenueChart } from '../features/dashboard/DashboardCharts'
import { RecentActivities, RecentDeals, TopReps, UpcomingTasks } from '../features/dashboard/DashboardLists'
import { KpiCard } from '../features/dashboard/KpiCard'
import { formatCompactCurrency, greeting } from '../lib/format'
import { getDashboard } from '../services/crm.service'
import { useAuth } from '../store/auth'

const VS_PREVIOUS = 'vs previous 30 days'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isPending, isError, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })
  const k = data?.kpis

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">
          {greeting()}, {user?.firstName}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Here's what's happening with your sales today.</p>
      </div>

      {isError ? (
        <Card>
          <ErrorState onRetry={refetch} />
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5 max-lg:[&>*:last-child]:col-span-2">
            <KpiCard label="Total Leads" icon={Target} value={k?.totalLeads.value.toLocaleString()} change={k?.totalLeads.change} comparison={VS_PREVIOUS} />
            <KpiCard label="Active Deals" icon={Briefcase} value={k?.activeDeals.value.toLocaleString()} />
            <KpiCard label="Pipeline Value" icon={Wallet} value={k && formatCompactCurrency(k.pipelineValue.value)} />
            <KpiCard label="Won Revenue" icon={DollarSign} value={k && formatCompactCurrency(k.wonRevenue.value)} change={k?.wonRevenue.change} comparison={VS_PREVIOUS} />
            <KpiCard label="Conversion Rate" icon={Percent} value={k && `${k.conversionRate.value}%`} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {isPending ? (
              ['Revenue Overview', 'Sales Pipeline', 'Lead Conversion', 'Deal Performance'].map((t) => <ChartSkeleton key={t} title={t} />)
            ) : (
              <>
                <RevenueChart data={data.revenue} />
                <PipelineChart data={data.pipeline} />
                <LeadConversionChart data={data.leadStatuses} />
                <DealPerformanceChart data={data.pipeline} />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {isPending ? (
              [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)
            ) : (
              <>
                <RecentActivities items={data.recentActivities} />
                <UpcomingTasks items={data.upcomingTasks} />
                <RecentDeals items={data.recentDeals} />
                <TopReps items={data.topReps} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
