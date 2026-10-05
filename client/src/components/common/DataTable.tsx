import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { PageMeta } from '../../types'
import { Skeleton } from '../ui/Skeleton'
import { ErrorState } from '../ui/States'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[] | undefined
  rowKey: (row: T) => string
  loading: boolean
  error: boolean
  onRetry: () => void
  empty: ReactNode
  meta?: PageMeta
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  caption: string
}

const PAGE_SIZES = [10, 25, 50]
const SKELETON_ROWS = 8
const NAV_BTN =
  'flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface-muted active:scale-95 disabled:opacity-40 disabled:active:scale-100'

/** Table from md up; stacked cards on phones (first column becomes the card title). */
export function DataTable<T>({
  columns, rows, rowKey, loading, error, onRetry, empty, meta, onPageChange, onPageSizeChange, caption,
}: DataTableProps<T>) {
  if (error) return <ErrorState onRetry={onRetry} />
  if (!loading && rows?.length === 0) return <>{empty}</>

  const [titleCol, ...detailCols] = columns

  return (
    <div>
      {/* Desktop / tablet */}
      <div className="hidden max-h-[calc(100vh-20rem)] overflow-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10 bg-surface-muted text-xs text-text-muted uppercase">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`px-4 py-2.5 font-medium whitespace-nowrap ${c.className ?? ''}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full max-w-32" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows?.map((row) => (
                  <tr key={rowKey(row)} className="animate-[fade-in_200ms_ease-out] transition-colors hover:bg-surface-muted/60">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.className ?? ''}`}>
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Phone */}
      <ul className="divide-y divide-border md:hidden" aria-label={caption}>
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="space-y-2 p-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-32" />
              </li>
            ))
          : rows?.map((row) => (
              <li key={rowKey(row)} className="animate-[fade-in_200ms_ease-out] p-4">
                {titleCol && <div className="mb-2.5 text-sm">{titleCol.cell(row)}</div>}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {detailCols.map((c) => (
                    <div key={c.key} className="min-w-0">
                      <dt className="text-xs text-text-muted">{c.header}</dt>
                      <dd className="truncate">{c.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
      </ul>

      {meta && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary">
          <label className="flex items-center gap-2">
            Rows
            <select
              value={meta.pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 rounded-md border border-border bg-surface px-2 text-text-primary"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <span aria-live="polite">
              Page {meta.page} of {meta.totalPages}
              <span className="hidden sm:inline"> · {meta.total} total</span>
            </span>
            <button onClick={() => onPageChange(meta.page - 1)} disabled={meta.page <= 1} aria-label="Previous page" className={NAV_BTN}>
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => onPageChange(meta.page + 1)} disabled={meta.page >= meta.totalPages} aria-label="Next page" className={NAV_BTN}>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
