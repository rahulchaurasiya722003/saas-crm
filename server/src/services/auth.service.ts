import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'
import { env } from '../config/env'
import type { User } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'
import { HttpError } from '../utils/response'
import { hashToken, newRefreshToken, REFRESH_TTL_MS, signAccessToken } from '../utils/tokens'

const BCRYPT_ROUNDS = 12

export const toPublicUser = (u: User) => ({
  id: u.id,
  organizationId: u.organizationId,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role,
})

async function issueSession(user: User) {
  const refreshToken = newRefreshToken()
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  })
  const accessToken = signAccessToken({ sub: user.id, org: user.organizationId, role: user.role })
  return { accessToken, refreshToken, user: toPublicUser(user) }
}

export type Session = Awaited<ReturnType<typeof issueSession>>

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export async function register(input: {
  organizationName: string
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  const existing = await prisma.user.findFirst({ where: { email: input.email } })
  if (existing) throw new HttpError(409, 'An account with this email already exists')
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
  const slug = `${slugify(input.organizationName) || 'org'}-${Math.random().toString(36).slice(2, 7)}`
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: 'ADMIN',
      organization: { create: { name: input.organizationName, slug } },
    },
  })
  return issueSession(user)
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({ where: { email } })
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false
  if (!user || !ok) throw new HttpError(401, 'Invalid email or password')
  if (user.status === 'DISABLED') throw new HttpError(403, 'This account has been disabled')
  await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } })
  return issueSession(user)
}

interface GoogleTokenInfo {
  aud?: string
  email?: string
  email_verified?: boolean | string
  given_name?: string
  family_name?: string
}

// Verifies a Google ID token and signs the user in. Creates the account on first sign-in.
export async function googleLogin(credential: string) {
  if (!env.GOOGLE_CLIENT_ID) throw new HttpError(503, 'Google sign-in is not configured')

  // Google validates the token's signature. We then check it was issued for this app.
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
  if (!res.ok) throw new HttpError(401, 'Google sign-in failed. Please try again.')
  const info = (await res.json()) as GoogleTokenInfo
  if (info.aud !== env.GOOGLE_CLIENT_ID) throw new HttpError(401, 'Google sign-in failed. Please try again.')

  const verified = info.email_verified === true || info.email_verified === 'true'
  if (!info.email || !verified) throw new HttpError(403, 'Your Google email address must be verified')
  const email = info.email.toLowerCase()

  const existing = await prisma.user.findFirst({ where: { email } })
  if (existing) {
    if (existing.status === 'DISABLED') throw new HttpError(403, 'This account has been disabled')
    await prisma.user.update({ where: { id: existing.id }, data: { lastActiveAt: new Date() } })
    return issueSession(existing)
  }

  // New Google users get their own organization and become its admin, the same as email sign-up.
  const firstName = info.given_name?.trim() || 'Google'
  const lastName = info.family_name?.trim() || 'User'
  const orgName = `${firstName}'s Workspace`
  const slug = `${slugify(orgName) || 'org'}-${randomBytes(3).toString('hex')}`
  const user = await prisma.user.create({
    data: {
      email,
      // Random, unusable password: Google accounts sign in through Google only.
      passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), BCRYPT_ROUNDS),
      firstName,
      lastName,
      role: 'ADMIN',
      organization: { create: { name: orgName, slug } },
    },
  })
  return issueSession(user)
}

export async function refresh(token: string | undefined) {
  if (!token) throw new HttpError(401, 'Session expired')
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })
  if (!record || record.revokedAt || record.expiresAt < new Date() || record.user.status === 'DISABLED') {
    throw new HttpError(401, 'Session expired')
  }
  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } })
  return issueSession(record.user)
}

export async function logout(token: string | undefined) {
  if (!token) return
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new HttpError(401, 'Session expired')
  return toPublicUser(user)
}
