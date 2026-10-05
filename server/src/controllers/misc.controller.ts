import type { Request, Response } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import * as repo from '../repositories/misc.repository'
import { sendSuccess } from '../utils/response'

const searchSchema = z.object({ q: z.string().trim().min(1).max(100) })

export const search = async (req: Request, res: Response) => {
  const { q } = searchSchema.parse(req.query)
  return sendSuccess(res, await repo.globalSearch(requireAuth(req).org, q))
}

export const notifications = async (req: Request, res: Response) => {
  const items = await repo.listNotifications(requireAuth(req).sub)
  return sendSuccess(res, { items, unread: items.filter((n) => !n.readAt).length })
}

export const readNotification = async (req: Request, res: Response) => {
  await repo.markNotificationRead(requireAuth(req).sub, String(req.params.id))
  return sendSuccess(res, null, 'Marked as read')
}

export const readAllNotifications = async (req: Request, res: Response) => {
  await repo.markAllNotificationsRead(requireAuth(req).sub)
  return sendSuccess(res, null, 'All notifications marked as read')
}
