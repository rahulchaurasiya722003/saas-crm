import type { Response } from 'express'

export function sendSuccess<T>(res: Response, data: T, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, data, message })
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: unknown[] = [],
  ) {
    super(message)
  }
}
