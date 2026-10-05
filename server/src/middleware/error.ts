import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env'
import { HttpError } from '../utils/response'

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', errors: [] })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.issues })
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message, errors: err.errors })
  }
  if (env.NODE_ENV !== 'test') console.error(err)
  res.status(500).json({ success: false, message: 'Something went wrong', errors: [] })
}
