import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'
import * as crm from '../../services/crm.service'
import type { SearchItem, SearchResults } from '../../types'
import { Skeleton } from '../ui/Skeleton'

const GROUP_LABELS: Record<keyof SearchResults, string> = {
  leads: 'Leads',
  contacts: 'Contacts',
  companies: 'Companies',
  deals: 'Deals',
  tasks: 'Tasks',
}
const RECENT_KEY = 'nexacrm-recent-searches'
const MAX_RECENT = 5

function readRecent(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function saveRecent(term: string) {
  try {
    const next = [term, ...readRecent().filter((r) => r !== term)].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return <PaletteDialog onClose={onClose} />
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [term, setTerm] = useState('')
  const [active, setActive] = useState(0)
  const [recent] = useState(readRecent)
  const debounced = useDebounce(term.trim(), 250)

  const { data, isFetching, isError } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => crm.search(debounced),
    enabled: debounced.length > 0,
    staleTime: 30_000,
  })

  const groups = useMemo(
    () => (Object.keys(GROUP_LABELS) as (keyof SearchResults)[]).map((k) => ({ key: k, items: data?.[k] ?? [] })).filter((g) => g.items.length > 0),
    [data],
  )
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  useEffect(() => {
    inputRef.current?.focus()
    const previous = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [])

  const choose = (item: SearchItem) => {
    saveRecent(term.trim())
    onClose()
    navigate(item.href)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && flat[active]) choose(flat[active])
  }

  const searching = debounced.length > 0
  const loading = searching && (isFetching || debounced !== term.trim()) && !data
  let index = -1

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 animate-[fade-in_150ms_ease-out] bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search" className="relative w-full max-w-xl animate-[pop-in_150ms_ease-out] overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              setActive(0)
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-label="Search leads, contacts, companies, deals and tasks"
            placeholder="Search anything..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">Esc</kbd>
        </div>

        <div id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {!searching && recent.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-medium text-text-muted">Recent searches</p>
              {recent.map((r) => (
                <button key={r} onClick={() => setTerm(r)} className="block w-full rounded-md px-2 py-2 text-left text-sm text-text-secondary hover:bg-surface-muted">
                  {r}
                </button>
              ))}
            </div>
          )}
          {!searching && recent.length === 0 && <p className="px-2 py-8 text-center text-sm text-text-muted">Type to search across your CRM.</p>}
          {loading && (
            <div className="space-y-2 p-2">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          )}
          {isError && <p className="px-2 py-8 text-center text-sm text-danger">Search failed. Please try again.</p>}
          {searching && data && flat.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-text-secondary">No results for “{debounced}”.</p>
          )}
          {groups.map((g) => (
            <div key={g.key} role="group" aria-label={GROUP_LABELS[g.key]}>
              <p className="px-2 pt-2 pb-1 text-xs font-medium text-text-muted">{GROUP_LABELS[g.key]}</p>
              {g.items.map((item) => {
                index += 1
                const i = index
                return (
                  <button
                    key={item.id}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm ${i === active ? 'bg-primary/10' : ''}`}
                  >
                    <span className="truncate font-medium">{item.title}</span>
                    {item.subtitle && <span className="truncate text-xs text-text-muted">{item.subtitle}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
