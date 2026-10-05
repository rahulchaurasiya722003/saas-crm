import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useDismiss } from '../../hooks/useDismiss'
import { relativeTime } from '../../lib/format'
import * as crm from '../../services/crm.service'
import { Skeleton } from '../ui/Skeleton'
import { ErrorState } from '../ui/States'

const KEY = ['notifications']
const REFETCH_MS = 60_000

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const qc = useQueryClient()
  const { data, isPending, isError, refetch } = useQuery({ queryKey: KEY, queryFn: crm.getNotifications, refetchInterval: REFETCH_MS })
  const invalidate = () => qc.invalidateQueries({ queryKey: KEY })
  const markOne = useMutation({ mutationFn: crm.markNotificationRead, onSuccess: invalidate })
  const markAll = useMutation({ mutationFn: crm.markAllNotificationsRead, onSuccess: invalidate })

  const unread = data?.unread ?? 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary"
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] animate-[pop-in_150ms_ease-out] rounded-lg border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <button
              onClick={() => markAll.mutate()}
              disabled={unread === 0 || markAll.isPending}
              className="flex items-center gap-1 text-xs text-primary disabled:text-text-muted"
            >
              <CheckCheck className="size-3.5" /> Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isPending && (
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            {isError && <ErrorState onRetry={refetch} />}
            {data?.items.length === 0 && <p className="px-4 py-10 text-center text-sm text-text-secondary">You're all caught up.</p>}
            <ul>
              {data?.items.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => !n.readAt && markOne.mutate(n.id)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-muted"
                  >
                    <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${n.readAt ? 'bg-transparent' : 'bg-primary'}`} />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${n.readAt ? 'text-text-secondary' : 'font-medium'}`}>{n.title}</span>
                      {n.body && <span className="block truncate text-xs text-text-muted">{n.body}</span>}
                      <span className="mt-0.5 block text-xs text-text-muted">{relativeTime(n.createdAt)}</span>
                    </span>
                    {!n.readAt && <span className="sr-only">Unread</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
