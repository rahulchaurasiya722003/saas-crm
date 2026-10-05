import { prisma } from '../lib/prisma'

const SEARCH_LIMIT = 5
const contains = (q: string) => ({ contains: q, mode: 'insensitive' as const })

export async function globalSearch(orgId: string, q: string) {
  const base = { organizationId: orgId }
  const live = { ...base, deletedAt: null }
  const [leads, contacts, companies, deals, tasks] = await Promise.all([
    prisma.lead.findMany({
      where: { ...live, OR: [{ firstName: contains(q) }, { lastName: contains(q) }, { email: contains(q) }] },
      select: { id: true, firstName: true, lastName: true, email: true },
      take: SEARCH_LIMIT,
    }),
    prisma.contact.findMany({
      where: { ...live, OR: [{ firstName: contains(q) }, { lastName: contains(q) }, { email: contains(q) }] },
      select: { id: true, firstName: true, lastName: true, email: true },
      take: SEARCH_LIMIT,
    }),
    prisma.company.findMany({ where: { ...live, name: contains(q) }, select: { id: true, name: true, industry: true }, take: SEARCH_LIMIT }),
    prisma.deal.findMany({ where: { ...live, name: contains(q) }, select: { id: true, name: true, stage: true }, take: SEARCH_LIMIT }),
    prisma.task.findMany({ where: { ...base, title: contains(q) }, select: { id: true, title: true, status: true }, take: SEARCH_LIMIT }),
  ])
  return {
    leads: leads.map((l) => ({ id: l.id, title: `${l.firstName} ${l.lastName}`, subtitle: l.email, href: '/leads' })),
    contacts: contacts.map((c) => ({ id: c.id, title: `${c.firstName} ${c.lastName}`, subtitle: c.email, href: '/contacts' })),
    companies: companies.map((c) => ({ id: c.id, title: c.name, subtitle: c.industry, href: '/companies' })),
    deals: deals.map((d) => ({ id: d.id, title: d.name, subtitle: d.stage, href: '/deals' })),
    tasks: tasks.map((t) => ({ id: t.id, title: t.title, subtitle: t.status, href: '/tasks' })),
  }
}

export const listNotifications = (userId: string) =>
  prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 })

export const markNotificationRead = (userId: string, id: string) =>
  prisma.notification.updateMany({ where: { id, userId, readAt: null }, data: { readAt: new Date() } })

export const markAllNotificationsRead = (userId: string) =>
  prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } })
