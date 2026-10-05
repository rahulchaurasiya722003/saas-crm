import { z } from 'zod'

export const registerSchema = z.object({
  organizationName: z.string().trim().min(2).max(80),
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
})

export const googleSchema = z.object({
  credential: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})
