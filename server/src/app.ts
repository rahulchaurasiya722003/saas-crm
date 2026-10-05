import path from 'node:path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error'
import { apiRouter } from './routes'

export const app = express()

// CSP is off because index.html bootstraps the theme with an inline script.
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.use('/api', apiRouter)

if (env.NODE_ENV === 'production') {
  // Compiled file lives at server/dist/src, so the client build is three levels up.
  const clientDist = path.resolve(__dirname, '../../../client/dist')
  app.use(express.static(clientDist))
  app.get(/^\/(?!api(\/|$)).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

app.use(notFound)
app.use(errorHandler)
