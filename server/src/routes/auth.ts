import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as c from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'

export const authRouter = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later', errors: [] },
})

authRouter.post('/register', limiter, c.register)
authRouter.post('/login', limiter, c.login)
authRouter.post('/google', limiter, c.google)
authRouter.post('/refresh', c.refresh)
authRouter.post('/logout', c.logout)
authRouter.get('/me', authenticate, c.me)
