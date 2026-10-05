import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { refreshSession, setAccessToken, setSessionExpiredHandler } from '../lib/api'
import * as authService from '../services/auth.service'
import type { User } from '../types'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: User | null
  status: Status
  login: (email: string, password: string) => Promise<void>
  register: (input: authService.RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const clear = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    setStatus('unauthenticated')
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    setSessionExpiredHandler(clear)
    refreshSession()
      .then((s) => {
        setUser(s.user)
        setStatus('authenticated')
      })
      .catch(() => setStatus('unauthenticated'))
  }, [clear])

  const value = useMemo<AuthContextValue>(() => {
    const start = (s: { accessToken: string; user: User }) => {
      setAccessToken(s.accessToken)
      setUser(s.user)
      setStatus('authenticated')
    }
    return {
      user,
      status,
      login: async (email, password) => start(await authService.login(email, password)),
      register: async (input) => start(await authService.register(input)),
      logout: async () => {
        try {
          await authService.logout()
        } finally {
          clear()
        }
      },
    }
  }, [user, status, clear])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
