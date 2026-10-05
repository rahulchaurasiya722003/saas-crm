import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client'
import type { ActivityType, DealStage, EntityType, LeadStatus, Role, TaskPriority, TaskStatus } from '../src/generated/prisma/enums'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

const DEMO_PASSWORD = 'Password123!'
const DAY = 24 * 60 * 60 * 1000

// Deterministic PRNG so every seed run produces the same data.
let state = 42
const rand = () => {
  state = (state * 1664525 + 1013904223) % 4294967296
  return state / 4294967296
}
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]!
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const daysAgo = (n: number) => new Date(Date.now() - n * DAY)
const daysAhead = (n: number) => new Date(Date.now() + n * DAY)

const FIRST = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Amelia', 'Daniel', 'Harper', 'Samuel', 'Priya', 'Arjun', 'Chen', 'Yuki', 'Fatima', 'Diego', 'Elena', 'Marcus', 'Nadia', 'Owen', 'Grace', 'Victor', 'Hannah', 'Rohan']
const LAST = ['Carter', 'Nguyen', 'Patel', 'Brooks', 'Fischer', 'Morales', 'Kim', 'Sullivan', 'Rossi', 'Andersen', 'Okafor', 'Bennett', 'Sharma', 'Lindqvist', 'Hayes', 'Dubois', 'Tanaka', 'Reyes', 'Walsh', 'Novak']
const COMPANIES: [string, string][] = [
  ['Northwind Logistics', 'Logistics'], ['Bluepeak Software', 'Software'], ['Harborview Health', 'Healthcare'], ['Ironclad Manufacturing', 'Manufacturing'],
  ['Lumen Analytics', 'Software'], ['Redwood Capital', 'Finance'], ['Summit Retail Group', 'Retail'], ['Verdant Energy', 'Energy'],
  ['Atlas Construction', 'Construction'], ['Meridian Education', 'Education'], ['Quantum Foods', 'Food & Beverage'], ['Silverline Media', 'Media'],
  ['Trident Security', 'Security'], ['Oakridge Insurance', 'Finance'], ['Pioneer Telecom', 'Telecom'], ['Coastal Hospitality', 'Hospitality'],
  ['Nimbus Cloud Services', 'Software'], ['Evergreen Pharma', 'Healthcare'], ['Falcon Aerospace', 'Aerospace'], ['Zenith Consulting', 'Consulting'],
]
const TITLES = ['CEO', 'CTO', 'VP of Sales', 'Head of Operations', 'Marketing Director', 'Procurement Manager', 'IT Manager', 'Finance Director', 'Product Manager', 'Founder']
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Outreach', 'Trade Show', 'Webinar', 'Partner']
const CITIES: [string, string][] = [['Austin', 'USA'], ['London', 'UK'], ['Berlin', 'Germany'], ['Toronto', 'Canada'], ['Singapore', 'Singapore'], ['Sydney', 'Australia'], ['Chicago', 'USA'], ['Amsterdam', 'Netherlands']]
const DEAL_NAMES = ['Annual Platform License', 'Enterprise Expansion', 'Pilot Program', 'Renewal 2026', 'Onboarding Package', 'Custom Integration', 'Team Upgrade', 'Multi-site Rollout', 'Support Contract', 'Analytics Add-on']
const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED']
const STAGES: DealStage[] = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']
const STAGE_PROB: Record<DealStage, number> = { NEW: 10, QUALIFIED: 30, PROPOSAL: 50, NEGOTIATION: 70, WON: 100, LOST: 0 }
const TASK_TITLES = ['Follow up on proposal', 'Send pricing sheet', 'Schedule product demo', 'Prepare contract draft', 'Review renewal terms', 'Call to confirm requirements', 'Share case study', 'Update CRM notes', 'Intro call with stakeholders', 'Send onboarding checklist']
const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED']
const ACTIVITY_TYPES: ActivityType[] = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK', 'STATUS_CHANGE']

const USERS: { first: string; last: string; role: Role; email: string }[] = [
  { first: 'Vivek', last: 'Sharma', role: 'ADMIN', email: 'admin@nexacrm.dev' },
  { first: 'Sarah', last: 'Mitchell', role: 'MANAGER', email: 'manager@nexacrm.dev' },
  { first: 'James', last: 'Cooper', role: 'SALES_AGENT', email: 'agent@nexacrm.dev' },
  { first: 'Elena', last: 'Vasquez', role: 'VIEWER', email: 'viewer@nexacrm.dev' },
  { first: 'Aiden', last: 'Brooks', role: 'SALES_AGENT', email: 'aiden.brooks@nexacrm.dev' },
  { first: 'Maya', last: 'Iyer', role: 'SALES_AGENT', email: 'maya.iyer@nexacrm.dev' },
  { first: 'Lucas', last: 'Fischer', role: 'SALES_AGENT', email: 'lucas.fischer@nexacrm.dev' },
  { first: 'Chloe', last: 'Bennett', role: 'MANAGER', email: 'chloe.bennett@nexacrm.dev' },
  { first: 'Omar', last: 'Haddad', role: 'SALES_AGENT', email: 'omar.haddad@nexacrm.dev' },
  { first: 'Priya', last: 'Nair', role: 'SALES_AGENT', email: 'priya.nair@nexacrm.dev' },
]

async function main() {
  await prisma.organization.deleteMany({ where: { slug: 'acme-demo' } })
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  const org = await prisma.organization.create({ data: { name: 'Acme Demo Inc.', slug: 'acme-demo' } })
  const orgId = org.id

  await prisma.user.createMany({
    data: USERS.map((u, i) => ({
      organizationId: orgId, email: u.email, passwordHash, firstName: u.first, lastName: u.last, role: u.role,
      lastActiveAt: daysAgo(i % 5),
    })),
  })
  const users = await prisma.user.findMany({ where: { organizationId: orgId } })
  const sellers = users.filter((u) => u.role !== 'VIEWER')

  await prisma.company.createMany({
    data: COMPANIES.map(([name, industry]) => {
      const [city, country] = pick(CITIES)
      return {
        organizationId: orgId, name, industry, city, country, ownerId: pick(sellers).id,
        website: `https://www.${name.toLowerCase().replace(/[^a-z]+/g, '')}.com`,
        phone: `+1 555 01${int(10, 99)}`, employees: pick([25, 80, 150, 400, 1200, 5000]), createdAt: daysAgo(int(20, 300)),
      }
    }),
  })
  const companies = await prisma.company.findMany({ where: { organizationId: orgId } })

  const person = () => ({ first: pick(FIRST), last: pick(LAST) })
  const emailFor = (first: string, last: string, domain: string) => `${first}.${last}@${domain}`.toLowerCase()
  const domainOf = (companyName: string) => `${companyName.toLowerCase().replace(/[^a-z]+/g, '')}.com`

  await prisma.contact.createMany({
    data: Array.from({ length: 40 }, () => {
      const c = pick(companies)
      const p = person()
      return {
        organizationId: orgId, companyId: c.id, ownerId: pick(sellers).id, firstName: p.first, lastName: p.last,
        email: emailFor(p.first, p.last, domainOf(c.name)), phone: `+1 555 02${int(10, 99)}`, jobTitle: pick(TITLES),
        createdAt: daysAgo(int(1, 200)),
      }
    }),
  })
  const contacts = await prisma.contact.findMany({ where: { organizationId: orgId } })

  await prisma.lead.createMany({
    data: Array.from({ length: 50 }, () => {
      const c = pick(companies)
      const p = person()
      return {
        organizationId: orgId, companyId: c.id, ownerId: pick(sellers).id, firstName: p.first, lastName: p.last,
        email: emailFor(p.first, p.last, domainOf(c.name)), phone: `+1 555 03${int(10, 99)}`, source: pick(SOURCES),
        status: pick(LEAD_STATUSES), createdAt: daysAgo(int(0, 90)),
      }
    }),
  })

  const deals = Array.from({ length: 30 }, () => {
    const c = pick(companies)
    const stage = pick(STAGES)
    const created = int(5, 180)
    const closed = stage === 'WON' || stage === 'LOST'
    return {
      organizationId: orgId, companyId: c.id,
      contactId: pick(contacts.filter((x) => x.companyId === c.id).concat(contacts.slice(0, 1))).id,
      ownerId: pick(sellers).id, name: `${c.name.split(' ')[0]} — ${pick(DEAL_NAMES)}`,
      value: int(4, 120) * 1000, stage, probability: STAGE_PROB[stage],
      expectedCloseDate: daysAhead(int(-10, 75)), closedAt: closed ? daysAgo(int(0, Math.min(created, 150))) : null,
      createdAt: daysAgo(created),
    }
  })
  await prisma.deal.createMany({ data: deals })
  const dealRows = await prisma.deal.findMany({ where: { organizationId: orgId } })

  await prisma.task.createMany({
    data: Array.from({ length: 50 }, () => {
      const status = pick(TASK_STATUSES)
      const related = pick(dealRows)
      return {
        organizationId: orgId, assigneeId: pick(sellers).id, title: pick(TASK_TITLES),
        description: `Related to ${related.name}.`, priority: pick(PRIORITIES), status,
        dueDate: daysAhead(int(-7, 21)), completedAt: status === 'COMPLETED' ? daysAgo(int(0, 6)) : null,
        relatedType: 'DEAL' as EntityType, relatedId: related.id, createdAt: daysAgo(int(1, 30)),
      }
    }),
  })

  const verb: Record<ActivityType, (n: string) => string> = {
    CALL: (n) => `Called ${n}`, EMAIL: (n) => `Sent email to ${n}`, MEETING: (n) => `Meeting with ${n}`,
    NOTE: (n) => `Added note to ${n}`, TASK: (n) => `Completed task for ${n}`, STATUS_CHANGE: (n) => `Deal moved to ${pick(STAGES)} — ${n}`,
  }
  await prisma.activity.createMany({
    data: Array.from({ length: 100 }, () => {
      const type = pick(ACTIVITY_TYPES)
      const c = pick(companies)
      const occurredAt = new Date(Date.now() - int(0, 14 * 24 * 60) * 60 * 1000)
      return {
        organizationId: orgId, userId: pick(sellers).id, type, title: verb[type](c.name), entityType: 'COMPANY' as EntityType,
        entityId: c.id, occurredAt, createdAt: occurredAt,
      }
    }),
  })

  const admin = users.find((u) => u.email === 'admin@nexacrm.dev')!
  await prisma.notification.createMany({
    data: [
      { title: 'New lead assigned to you', body: 'A new lead from the website is waiting.' },
      { title: 'Deal moved to Negotiation', body: 'Northwind — Enterprise Expansion advanced a stage.' },
      { title: 'Task due soon', body: 'Follow up on proposal is due tomorrow.' },
    ].map((n, i) => ({ organizationId: orgId, userId: admin.id, ...n, createdAt: daysAgo(i), readAt: i === 2 ? new Date() : null })),
  })

  console.log(`Seeded organization "${org.name}". Login: admin@nexacrm.dev / ${DEMO_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
