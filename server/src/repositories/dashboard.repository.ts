import { prisma } from '../lib/prisma'

const DAY_MS = 24 * 60 * 60 * 1000
const MONTHS_OF_HISTORY = 6

export async function getDashboard(orgId: string) {
  const now = new Date()
  const periodStart = new Date(now.getTime() - 30 * DAY_MS)
  const prevStart = new Date(now.getTime() - 60 * DAY_MS)
  const base = { organizationId: orgId, deletedAt: null }

  const [
    totalLeads, leadsNow, leadsPrev, converted,
    activeDeals, pipelineAgg, wonAgg, wonPrevAgg,
    stageGroups, leadGroups, wonDeals, recentActivities, upcomingTasks, recentDeals, repGroups,
  ] = await Promise.all([
    prisma.lead.count({ where: base }),
    prisma.lead.count({ where: { ...base, createdAt: { gte: periodStart } } }),
    prisma.lead.count({ where: { ...base, createdAt: { gte: prevStart, lt: periodStart } } }),
    prisma.lead.count({ where: { ...base, status: 'CONVERTED' } }),
    prisma.deal.count({ where: { ...base, stage: { notIn: ['WON', 'LOST'] } } }),
    prisma.deal.aggregate({ where: { ...base, stage: { notIn: ['WON', 'LOST'] } }, _sum: { value: true } }),
    prisma.deal.aggregate({ where: { ...base, stage: 'WON', closedAt: { gte: periodStart } }, _sum: { value: true } }),
    prisma.deal.aggregate({ where: { ...base, stage: 'WON', closedAt: { gte: prevStart, lt: periodStart } }, _sum: { value: true } }),
    prisma.deal.groupBy({ by: ['stage'], where: base, _count: { _all: true }, _sum: { value: true } }),
    prisma.lead.groupBy({ by: ['status'], where: base, _count: { _all: true } }),
    prisma.deal.findMany({
      where: { ...base, stage: 'WON', closedAt: { gte: new Date(now.getFullYear(), now.getMonth() - (MONTHS_OF_HISTORY - 1), 1) } },
      select: { value: true, closedAt: true },
    }),
    prisma.activity.findMany({
      where: { organizationId: orgId },
      orderBy: { occurredAt: 'desc' },
      take: 6,
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.task.findMany({
      where: { organizationId: orgId, status: { not: 'COMPLETED' } },
      orderBy: [{ dueDate: 'asc' }],
      take: 5,
      include: { assignee: { select: { firstName: true, lastName: true } } },
    }),
    prisma.deal.findMany({
      where: base,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { company: { select: { name: true } }, owner: { select: { firstName: true, lastName: true } } },
    }),
    prisma.deal.groupBy({
      by: ['ownerId'],
      where: { ...base, stage: 'WON', ownerId: { not: null } },
      _sum: { value: true },
      _count: { _all: true },
      orderBy: { _sum: { value: 'desc' } },
      take: 5,
    }),
  ])

  const reps = await prisma.user.findMany({
    where: { id: { in: repGroups.map((r) => r.ownerId).filter((id): id is string => id !== null) } },
    select: { id: true, firstName: true, lastName: true },
  })

  const monthly = new Map<string, number>()
  for (let i = MONTHS_OF_HISTORY - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthly.set(d.toLocaleString('en', { month: 'short' }), 0)
  }
  for (const d of wonDeals) {
    if (!d.closedAt) continue
    const key = d.closedAt.toLocaleString('en', { month: 'short' })
    monthly.set(key, (monthly.get(key) ?? 0) + Number(d.value))
  }

  const pct = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100))
  const wonNow = Number(wonAgg._sum.value ?? 0)

  return {
    kpis: {
      totalLeads: { value: totalLeads, change: pct(leadsNow, leadsPrev) },
      activeDeals: { value: activeDeals, change: 0 },
      pipelineValue: { value: Number(pipelineAgg._sum.value ?? 0), change: 0 },
      wonRevenue: { value: wonNow, change: pct(wonNow, Number(wonPrevAgg._sum.value ?? 0)) },
      conversionRate: { value: totalLeads === 0 ? 0 : Math.round((converted / totalLeads) * 1000) / 10, change: 0 },
    },
    revenue: [...monthly].map(([month, revenue]) => ({ month, revenue })),
    pipeline: stageGroups.map((g) => ({ stage: g.stage, count: g._count._all, value: Number(g._sum.value ?? 0) })),
    leadStatuses: leadGroups.map((g) => ({ status: g.status, count: g._count._all })),
    recentActivities,
    upcomingTasks,
    recentDeals: recentDeals.map((d) => ({ ...d, value: Number(d.value) })),
    topReps: repGroups.map((r) => {
      const u = reps.find((x) => x.id === r.ownerId)
      return { id: r.ownerId, name: u ? `${u.firstName} ${u.lastName}` : 'Unknown', revenue: Number(r._sum.value ?? 0), deals: r._count._all }
    }),
  }
}
