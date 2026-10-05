import { Search } from 'lucide-react'

interface ListToolbarProps {
  search: string
  onSearch: (v: string) => void
  placeholder: string
  status?: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string }
}

export function ListToolbar({ search, onSearch, placeholder, status }: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 w-full rounded-md border border-border bg-surface pr-3 pl-9 text-sm outline-none transition-shadow placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 sm:h-9"
        />
      </div>
      {status && (
        <select
          value={status.value}
          onChange={(e) => status.onChange(e.target.value)}
          aria-label={status.label}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm sm:h-9"
        >
          <option value="">{status.label}</option>
          {status.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
