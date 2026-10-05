export type Role = 'ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'VIEWER'

export interface User {
  id: string
  organizationId: string
  email: string
  firstName: string
  lastName: string
  role: Role
}

export interface SessionData {
  accessToken: string
  user: User
}

export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  items: T[]
  meta: PageMeta
}

export interface ListParams {
  page: number
  pageSize: number
  search?: string
  status?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PersonRef {
  id: string
  firstName: string
  lastName: string
}

export interface CompanyRef {
  id: string
  name: string
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CONVERTED'
export type DealStage = 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  source: string | null
  status: LeadStatus
  createdAt: string
  owner: PersonRef | null
  company: CompanyRef | null
}

export interface Company {
  id: string
  name: string
  industry: string | null
  website: string | null
  city: string | null
  country: string | null
  employees: number | null
  createdAt: string
  owner: PersonRef | null
  _count: { contacts: number; deals: number }
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  jobTitle: string | null
  createdAt: string
  owner: PersonRef | null
  company: CompanyRef | null
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'STATUS_CHANGE'

export interface Deal {
  id: string
  name: string
  value: string
  stage: DealStage
  probability: number
  expectedCloseDate: string | null
  createdAt: string
  owner: PersonRef | null
  company: CompanyRef | null
}

export interface PipelineStage {
  stage: DealStage
  count: number
  totalValue: number
  deals: Deal[]
}

export interface PipelineData {
  stages: PipelineStage[]
}

export interface Task {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  assignee: PersonRef | null
}

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  body: string | null
  entityType: string | null
  occurredAt: string
  user: PersonRef | null
}

export interface Kpi {
  value: number
  change: number
}

export interface DashboardData {
  kpis: {
    totalLeads: Kpi
    activeDeals: Kpi
    pipelineValue: Kpi
    wonRevenue: Kpi
    conversionRate: Kpi
  }
  revenue: { month: string; revenue: number }[]
  pipeline: { stage: DealStage; count: number; value: number }[]
  leadStatuses: { status: LeadStatus; count: number }[]
  recentActivities: {
    id: string
    type: string
    title: string
    occurredAt: string
    user: { firstName: string; lastName: string } | null
  }[]
  upcomingTasks: {
    id: string
    title: string
    priority: string
    dueDate: string | null
    assignee: { firstName: string; lastName: string } | null
  }[]
  recentDeals: {
    id: string
    name: string
    value: number
    stage: DealStage
    company: { name: string } | null
    owner: { firstName: string; lastName: string } | null
  }[]
  topReps: { id: string | null; name: string; revenue: number; deals: number }[]
}

export interface SearchItem {
  id: string
  title: string
  subtitle: string | null
  href: string
}

export type SearchResults = Record<'leads' | 'contacts' | 'companies' | 'deals' | 'tasks', SearchItem[]>

export interface AppNotification {
  id: string
  title: string
  body: string | null
  readAt: string | null
  createdAt: string
}
