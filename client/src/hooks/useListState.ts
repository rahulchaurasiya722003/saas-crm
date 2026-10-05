import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { ListParams, Paginated } from '../types'
import { useDebounce } from './useDebounce'

const DEFAULT_PAGE_SIZE = 10

/** Shared server-side pagination/search/filter state for list pages. */
export function useListState<T>(key: string, fetcher: (p: ListParams) => Promise<Paginated<T>>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const debouncedSearch = useDebounce(search)

  const params: ListParams = { page, pageSize, search: debouncedSearch || undefined, status: status || undefined }
  const query = useQuery({ queryKey: [key, params], queryFn: () => fetcher(params), placeholderData: keepPreviousData })

  return {
    query,
    search,
    status,
    pageSize,
    setPage,
    setPageSize: (n: number) => {
      setPageSize(n)
      setPage(1)
    },
    setSearch: (v: string) => {
      setSearch(v)
      setPage(1)
    },
    setStatus: (v: string) => {
      setStatus(v)
      setPage(1)
    },
    hasFilters: Boolean(debouncedSearch || status),
    clearFilters: () => {
      setSearch('')
      setStatus('')
      setPage(1)
    },
  }
}
