import type { CookieOptions, Request, Response } from 'express'
import { env } from '../config/env'
import { requireAuth } from '../middleware/auth'
import * as authService from '../services/auth.service'
import { sendSuccess } from '../utils/response'
import { REFRESH_TTL_MS } from '../utils/tokens'
import { loginSchema, registerSchema } from '../validators/auth'

const COOKIE = 'refresh_token'
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: REFRESH_TTL_MS,
}

function respond(res: Response, session: authService.Session, message: string, status = 200) {
  res.cookie(COOKIE, session.refreshToken, cookieOptions)
  return sendSuccess(res, { accessToken: session.accessToken, user: session.user }, message, status)
}

export const register = async (req: Request, res: Response) =>
  respond(res, await authService.register(registerSchema.parse(req.body)), 'Account created', 201)

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body)
  return respond(res, await authService.login(email, password), 'Signed in')
}

export const refresh = async (req: Request, res: Response) =>
  respond(res, await authService.refresh(req.cookies[COOKIE]), 'Session refreshed')

export const logout = async (req: Request, res: Response) => {
  await authService.logout(req.cookies[COOKIE])
  res.clearCookie(COOKIE, { ...cookieOptions, maxAge: undefined })
  return sendSuccess(res, null, 'Signed out')
}

export const me = async (req: Request, res: Response) => sendSuccess(res, await authService.me(requireAuth(req).sub))
