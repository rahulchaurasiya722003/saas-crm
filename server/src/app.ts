import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error'
import { apiRouter } from './routes'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.use('/api', apiRouter)

app.use(notFound)
app.use(errorHandler)
