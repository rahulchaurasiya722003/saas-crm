import type { Request, RequestHandler } from 'express'
import { can, type Permission } from '../config/permissions'
import { HttpError } from '../utils/response'
import { verifyAccessToken } from '../utils/tokens'

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Authentication required')
  try {
    req.auth = verifyAccessToken(header.slice(7))
  } catch {
    throw new HttpError(401, 'Invalid or expired token')
  }
  next()
}

export const authorize =
  (permission: Permission): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth || !can(req.auth.role, permission)) {
      throw new HttpError(403, 'You do not have permission to do this')
    }
    next()
  }

export function requireAuth(req: Request) {
  if (!req.auth) throw new HttpError(401, 'Authentication required')
  return req.auth
}
