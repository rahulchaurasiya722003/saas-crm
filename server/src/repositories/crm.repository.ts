import type { Prisma } from '../generated/prisma/client'
import { ActivityType, DealStage, LeadStatus, TaskStatus } from '../generated/prisma/enums'
import { prisma } from '../lib/prisma'
import { paginate, type ListQuery } from '../validators/common'

const ownerSelect = { select: { id: true, firstName: true, lastName: true } } as const
const companySelect = { select: { id: true, name: true } } as const

const contains = (search: string) => ({ contains: search, mode: 'insensitive' as const })

function sortBy<T extends string>(q: ListQuery, allowed: readonly T[], fallback: T) {
  const field = allowed.find((f) => f === q.sort) ?? fallback
  return { [field]: q.order }
}

export async function listLeads(orgId: string, q: ListQuery) {
  const status = Object.values(LeadStatus).find((s) => s === q.status)
  const where: Prisma.LeadWhereInput = {
    organizationId: orgId,
    deletedAt: null,
    ...(status && { status }),
    ...(q.search && {
      OR: [
        { firstName: contains(q.search) },
        { lastName: contains(q.search) },
        { email: contains(q.search) },
        { company: { name: contains(q.search) } },
      ],
    }),
  }
  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { owner: ownerSelect, company: companySelect },
      orderBy: sortBy(q, ['createdAt', 'firstName', 'status'] as const, 'createdAt'),
      ...paginate(q),
    }),
    prisma.lead.count({ where }),
  ])
  return { items, total }
}

export async function listCompanies(orgId: string, q: ListQuery) {
  const where: Prisma.CompanyWhereInput = {
    organizationId: orgId,
    deletedAt: null,
    ...(q.search && { OR: [{ name: contains(q.search) }, { industry: contains(q.search) }] }),
  }
  const [items, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { owner: ownerSelect, _count: { select: { contacts: true, deals: true } } },
      orderBy: sortBy(q, ['createdAt', 'name'] as const, 'name'),
      ...paginate(q),
    }),
    prisma.company.count({ where }),
  ])
  return { items, total }
}

export async function listContacts(orgId: string, q: ListQuery) {
  const where: Prisma.ContactWhereInput = {
    organizationId: orgId,
    deletedAt: null,
    ...(q.search && {
      OR: [
        { firstName: contains(q.search) },
        { lastName: contains(q.search) },
        { email: contains(q.search) },
        { company: { name: contains(q.search) } },
      ],
    }),
  }
  const [items, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: { owner: ownerSelect, company: companySelect },
      orderBy: sortBy(q, ['createdAt', 'firstName'] as const, 'createdAt'),
      ...paginate(q),
    }),
    prisma.contact.count({ where }),
  ])
  return { items, total }
}

export async function listDeals(orgId: string, q: ListQuery) {
  const stage = Object.values(DealStage).find((s) => s === q.status)
  const where: Prisma.DealWhereInput = {
    organizationId: orgId,
    deletedAt: null,
    ...(stage && { stage }),
    ...(q.search && {
      OR: [{ name: contains(q.search) }, { company: { name: contains(q.search) } }],
    }),
  }
  const [items, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      include: { owner: ownerSelect, company: companySelect },
      orderBy: sortBy(q, ['createdAt', 'name', 'value', 'stage', 'expectedCloseDate'] as const, 'createdAt'),
      ...paginate(q),
    }),
    prisma.deal.count({ where }),
  ])
  return { items, total }
}

const PIPELINE_CARDS_PER_STAGE = 30

export async function getPipeline(orgId: string) {
  const stages = Object.values(DealStage)
  const [totals, ...perStage] = await Promise.all([
    prisma.deal.groupBy({
      by: ['stage'],
      where: { organizationId: orgId, deletedAt: null },
      _count: { _all: true },
      _sum: { value: true },
    }),
    ...stages.map((stage) =>
      prisma.deal.findMany({
        where: { organizationId: orgId, deletedAt: null, stage },
        include: { owner: ownerSelect, company: companySelect },
        orderBy: { value: 'desc' },
        take: PIPELINE_CARDS_PER_STAGE,
      }),
    ),
  ])
  return {
    stages: stages.map((stage, i) => {
      const agg = totals.find((t) => t.stage === stage)
      return {
        stage,
        count: agg?._count._all ?? 0,
        totalValue: Number(agg?._sum.value ?? 0),
        deals: perStage[i],
      }
    }),
  }
}

export async function listTasks(orgId: string, q: ListQuery) {
  const status = Object.values(TaskStatus).find((s) => s === q.status)
  const where: Prisma.TaskWhereInput = {
    organizationId: orgId,
    ...(status && { status }),
    ...(q.search && { OR: [{ title: contains(q.search) }, { description: contains(q.search) }] }),
  }
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { assignee: ownerSelect },
      orderBy: sortBy(q, ['createdAt', 'dueDate', 'priority', 'status', 'title'] as const, 'createdAt'),
      ...paginate(q),
    }),
    prisma.task.count({ where }),
  ])
  return { items, total }
}

export async function listActivities(orgId: string, q: ListQuery) {
  const type = Object.values(ActivityType).find((t) => t === q.status)
  const where: Prisma.ActivityWhereInput = {
    organizationId: orgId,
    ...(type && { type }),
    ...(q.search && { OR: [{ title: contains(q.search) }, { body: contains(q.search) }] }),
  }
  const [items, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { user: ownerSelect },
      orderBy: { occurredAt: q.order },
      ...paginate(q),
    }),
    prisma.activity.count({ where }),
  ])
  return { items, total }
}
