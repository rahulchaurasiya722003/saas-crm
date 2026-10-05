import { z } from 'zod'

export const MAX_PAGE_SIZE = 100

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(10),
  search: z.string().trim().max(100).optional(),
  status: z.string().trim().max(30).optional(),
  sort: z.string().trim().max(30).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type ListQuery = z.infer<typeof listQuerySchema>

export const paginate = (q: ListQuery) => ({ skip: (q.page - 1) * q.pageSize, take: q.pageSize })

export const pageMeta = (q: ListQuery, total: number) => ({
  page: q.page,
  pageSize: q.pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / q.pageSize)),
})
