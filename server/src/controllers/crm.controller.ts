import type { Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'
import { getDashboard } from '../repositories/dashboard.repository'
import * as repo from '../repositories/crm.repository'
import { sendSuccess } from '../utils/response'
import { listQuerySchema, pageMeta, type ListQuery } from '../validators/common'

type Lister = (orgId: string, q: ListQuery) => Promise<{ items: unknown[]; total: number }>

const listHandler = (fn: Lister) => async (req: Request, res: Response) => {
  const auth = requireAuth(req)
  const q = listQuerySchema.parse(req.query)
  const { items, total } = await fn(auth.org, q)
  return sendSuccess(res, { items, meta: pageMeta(q, total) })
}

export const listLeads = listHandler(repo.listLeads)
export const listCompanies = listHandler(repo.listCompanies)
export const listContacts = listHandler(repo.listContacts)
export const listDeals = listHandler(repo.listDeals)
export const listTasks = listHandler(repo.listTasks)
export const listActivities = listHandler(repo.listActivities)

export const pipeline = async (req: Request, res: Response) =>
  sendSuccess(res, await repo.getPipeline(requireAuth(req).org))

export const dashboard = async (req: Request, res: Response) =>
  sendSuccess(res, await getDashboard(requireAuth(req).org))
