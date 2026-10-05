import type { Role } from '../generated/prisma/client'

export const PERMISSIONS = [
  'leads:read',
  'leads:write',
  'companies:read',
  'companies:write',
  'contacts:read',
  'contacts:write',
  'deals:read',
  'deals:write',
  'tasks:read',
  'tasks:write',
  'reports:read',
  'team:read',
  'team:write',
  'audit:read',
  'org:write',
] as const

export type Permission = (typeof PERMISSIONS)[number]

const VIEWER_EXCLUDED: readonly Permission[] = ['team:read', 'audit:read']

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMIN: PERMISSIONS,
  MANAGER: PERMISSIONS.filter((p) => p !== 'org:write'),
  SALES_AGENT: [
    'leads:read',
    'leads:write',
    'companies:read',
    'companies:write',
    'contacts:read',
    'contacts:write',
    'deals:read',
    'deals:write',
    'tasks:read',
    'tasks:write',
  ],
  VIEWER: PERMISSIONS.filter((p) => p.endsWith(':read') && !VIEWER_EXCLUDED.includes(p)),
}

export const can = (role: Role, permission: Permission) => ROLE_PERMISSIONS[role].includes(permission)
