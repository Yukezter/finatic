import 'dotenv/config'
import morgan from 'morgan'
import compression from 'compression'
import express from 'express'

import { proxyRouter, sseRouter } from './routes'
import { routeNotFound, errorHandler } from './errors'

const PORT = process.env.PORT || 3000
const proxyApp = express()
const sseApp = express()

proxyApp.disable('x-powered-by')
proxyApp.use(morgan('dev'))

proxyApp.set('trust proxy', 1)
proxyApp.use(proxyRouter)
proxyApp.use(routeNotFound)
proxyApp.use(errorHandler)

proxyApp.listen(PORT, () => {
  console.log('REST server connected...')
})

sseApp.use(compression())
sseApp.use(sseRouter)
sseApp.use(routeNotFound)
sseApp.use(errorHandler)

sseApp.listen(3001, () => {
  console.log('SSE server connected...')
})
