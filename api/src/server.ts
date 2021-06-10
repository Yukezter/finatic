import 'dotenv/config'
import redis from 'redis'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'

import { proxyRouter, sseRouter } from './routes'
import { routeNotFound, errorHandler } from './errors'

export const redisClient = redis.createClient()

const PROXY_APP_PORT = process.env.PROXY_APP_PORT || 3000
const proxyApp = express()

proxyApp.disable('x-powered-by')
proxyApp.set('trust proxy', '194.195.209.172')
proxyApp.use(morgan('dev'))
proxyApp.use(helmet())
proxyApp.use(proxyRouter)
proxyApp.use(routeNotFound)
proxyApp.use(errorHandler)

proxyApp.listen(PROXY_APP_PORT, () => {
  console.log('REST server connected...')
})

const SSE_APP_PORT = process.env.SSE_APP_PORT || 3001
const sseApp = express()

sseApp.disable('x-powered-by')
sseApp.set('trust proxy', '194.195.209.172')
sseApp.use(helmet())
sseApp.use(compression())
sseApp.use(sseRouter)
sseApp.use(routeNotFound)
sseApp.use(errorHandler)

sseApp.listen(SSE_APP_PORT, () => {
  console.log('SSE server connected...')
})
