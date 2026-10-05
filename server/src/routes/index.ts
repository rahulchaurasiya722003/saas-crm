import { Router } from 'express'
import * as crm from '../controllers/crm.controller'
import * as misc from '../controllers/misc.controller'
import { prisma } from '../lib/prisma'
import { authenticate, authorize } from '../middleware/auth'
import { sendSuccess } from '../utils/response'
import { authRouter } from './auth'

export const apiRouter = Router()

apiRouter.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`
  sendSuccess(res, { status: 'ok', database: 'up', time: new Date().toISOString() })
})

apiRouter.use('/auth', authRouter)

apiRouter.use(authenticate)
apiRouter.get('/search', misc.search)
apiRouter.get('/notifications', misc.notifications)
apiRouter.patch('/notifications/read-all', misc.readAllNotifications)
apiRouter.patch('/notifications/:id/read', misc.readNotification)
// Home dashboard is available to every signed-in role; the deeper /reports pages stay restricted.
apiRouter.get('/dashboard', crm.dashboard)
apiRouter.get('/leads', authorize('leads:read'), crm.listLeads)
apiRouter.get('/companies', authorize('companies:read'), crm.listCompanies)
apiRouter.get('/contacts', authorize('contacts:read'), crm.listContacts)
apiRouter.get('/deals', authorize('deals:read'), crm.listDeals)
apiRouter.get('/deals/pipeline', authorize('deals:read'), crm.pipeline)
apiRouter.get('/tasks', authorize('tasks:read'), crm.listTasks)
// Activities feed mirrors the dashboard feed, so every signed-in role may read it.
apiRouter.get('/activities', crm.listActivities)
