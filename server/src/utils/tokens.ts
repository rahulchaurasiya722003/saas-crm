import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { Role } from '../generated/prisma/client'

export const ACCESS_TTL_SECONDS = 15 * 60
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000

export interface AccessPayload {
  sub: string
  org: string
  role: Role
}

export const signAccessToken = (payload: AccessPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL_SECONDS })

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload

export const newRefreshToken = () => crypto.randomBytes(48).toString('hex')
export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
