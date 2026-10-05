import { api, type ApiResponse } from '../lib/api'
import type {
  ActivityItem,
  AppNotification,
  Company,
  Contact,
  DashboardData,
  Deal,
  Lead,
  ListParams,
  Paginated,
  PipelineData,
  SearchResults,
  Task,
} from '../types'

async function list<T>(path: string, params: ListParams) {
  const res = await api.get<ApiResponse<Paginated<T>>>(path, { params })
  return res.data.data
}

export const getLeads = (p: ListParams) => list<Lead>('/leads', p)
export const getCompanies = (p: ListParams) => list<Company>('/companies', p)
export const getContacts = (p: ListParams) => list<Contact>('/contacts', p)
export const getDeals = (p: ListParams) => list<Deal>('/deals', p)
export const getTasks = (p: ListParams) => list<Task>('/tasks', p)
export const getActivities = (p: ListParams) => list<ActivityItem>('/activities', p)

export async function getPipeline() {
  const res = await api.get<ApiResponse<PipelineData>>('/deals/pipeline')
  return res.data.data
}

export async function getDashboard() {
  const res = await api.get<ApiResponse<DashboardData>>('/dashboard')
  return res.data.data
}

export async function search(q: string) {
  const res = await api.get<ApiResponse<SearchResults>>('/search', { params: { q } })
  return res.data.data
}

export async function getNotifications() {
  const res = await api.get<ApiResponse<{ items: AppNotification[]; unread: number }>>('/notifications')
  return res.data.data
}

export const markNotificationRead = (id: string) => api.patch(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => api.patch('/notifications/read-all')
