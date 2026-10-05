import { api, type ApiResponse } from '../lib/api'
import type { SessionData } from '../types'

export interface RegisterInput {
  organizationName: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export async function login(email: string, password: string) {
  const res = await api.post<ApiResponse<SessionData>>('/auth/login', { email, password })
  return res.data.data
}

export async function register(input: RegisterInput) {
  const res = await api.post<ApiResponse<SessionData>>('/auth/register', input)
  return res.data.data
}

export async function logout() {
  await api.post('/auth/logout')
}
