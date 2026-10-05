import type { AccessPayload } from '../utils/tokens'

declare global {
  namespace Express {
    interface Request {
      auth?: AccessPayload
    }
  }
}

export {}
