import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader } from '../../components/ui/Card'
import { formatCompactCurrency, formatCurrency, titleCase } from '../../lib/format'
import type { DashboardData } from '../../types'

const AXIS = { fontSize: 12, fill: 'var(--text-muted)' }
const TOOLTIP_STYLE = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-primary)',
}
const CHART_HEIGHT = 240
/** Colors carry meaning: green = good outcome, red = bad outcome. */
const SEMANTIC: Record<string, string> = {
  NEW: "var(--info)",
  QUALIFIED: "var(--warning)",
  PROPOSAL: "var(--primary)",
  NEGOTIATION: "var(--text-muted)",
  WON: "var(--success)",
  LOST: "var(--danger)",
  CONTACTED: "var(--primary)",
  UNQUALIFIED: "var(--text-muted)",
  CONVERTED: "var(--success)",
  OPEN: "var(--primary)",
}
const colorFor = (key: string, fallbackIndex: number) => SEMANTIC[key.toUpperCase()] ?? PALETTE[fallbackIndex % PALETTE.length]
const PALETTE = ['var(--primary)', 'var(--info)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--text-muted)']

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <div className="p-4 pt-3" style={{ height: CHART_HEIGHT + 32 }}>
        {children}
      </div>
    </Card>
  )
}

export function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="p-4">
        <div className="animate-pulse rounded-md bg-surface-muted" style={{ height: CHART_HEIGHT }} />
      </div>
    </Card>
  )
}

export function RevenueChart({ data }: { data: DashboardData['revenue'] }) {
  return (
    <ChartCard title="Revenue Overview" subtitle="Won revenue, last 6 months">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} width={56} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--surface-muted)' }} formatter={(v) => [formatCurrency(Number(v)), 'Revenue']} />
          <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function PipelineChart({ data }: { data: DashboardData['pipeline'] }) {
  const rows = data.map((d) => ({ ...d, label: titleCase(d.stage) }))
  return (
    <ChartCard title="Sales Pipeline" subtitle="Deal value by stage">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} />
          <YAxis type="category" dataKey="label" tick={AXIS} axisLine={false} tickLine={false} width={84} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--surface-muted)' }} formatter={(v, _n, item) => [`${formatCurrency(Number(v))} · ${item.payload.count} deals`, 'Value']} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {rows.map((r, i) => (
              <Cell key={r.stage} fill={colorFor(r.stage, i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function DonutChart({ rows, unit }: { rows: { name: string; value: number }[]; unit: string }) {
  const total = rows.reduce((s, r) => s + r.value, 0)
  return (
    <div className="flex h-full items-center gap-4">
      <div className="h-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="90%" paddingAngle={2} stroke="var(--surface)">
              {rows.map((r, i) => (
                <Cell key={r.name} fill={colorFor(r.name, i)} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${v} ${unit}`, String(n)]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-32 shrink-0 space-y-1.5 text-xs">
        {rows.map((r, i) => (
          <li key={r.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span aria-hidden className="size-2 rounded-full" style={{ background: colorFor(r.name, i) }} />
              {r.name}
            </span>
            <span className="font-medium">{total ? Math.round((r.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LeadConversionChart({ data }: { data: DashboardData['leadStatuses'] }) {
  return (
    <ChartCard title="Lead Conversion" subtitle="Leads by status">
      <DonutChart rows={data.map((d) => ({ name: titleCase(d.status), value: d.count }))} unit="leads" />
    </ChartCard>
  )
}

export function DealPerformanceChart({ data }: { data: DashboardData['pipeline'] }) {
  const count = (stages: string[]) => data.filter((d) => stages.includes(d.stage)).reduce((s, d) => s + d.count, 0)
  return (
    <ChartCard title="Deal Performance" subtitle="Won, lost and open deals">
      <DonutChart
        unit="deals"
        rows={[
          { name: 'Open', value: count(['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION']) },
          { name: 'Won', value: count(['WON']) },
          { name: 'Lost', value: count(['LOST']) },
        ]}
      />
    </ChartCard>
  )
}
