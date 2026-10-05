import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { SessionData } from '../types'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

export const api = axios.create({ baseURL: '/api', withCredentials: true })
const bare = axios.create({ baseURL: '/api', withCredentials: true })

let accessToken: string | null = null
let onSessionExpired: () => void = () => {}

export const setAccessToken = (token: string | null) => {
  accessToken = token
}
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn
}

// Single-flight: refresh tokens rotate, so concurrent refreshes must share one request.
let refreshing: Promise<SessionData> | null = null
export function refreshSession(): Promise<SessionData> {
  refreshing ??= bare
    .post<ApiResponse<SessionData>>('/auth/refresh')
    .then((res) => {
      accessToken = res.data.data.accessToken
      return res.data.data
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthCall = AUTH_PATHS.some((p) => config?.url?.startsWith(p))
    if (error.response?.status === 401 && config && !config._retried && !isAuthCall) {
      config._retried = true
      try {
        await refreshSession()
        return api(config)
      } catch {
        accessToken = null
        onSessionExpired()
      }
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data?.message ?? fallback
  return fallback
}
