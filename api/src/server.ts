import 'dotenv/config'
import express, { RequestHandler, ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'

import { proxyRouter, sseRouter } from './routes'
import { RouteNotFound, CustomError } from './Errors'

const routeNotFound: RequestHandler = (req, _res, next): void => {
  next(new RouteNotFound(req.originalUrl))
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next): void => {
  const safeForClient = error instanceof CustomError
  const clientError = safeForClient
    ? (({ message, code, status, data }) => ({
        message,
        code,
        status,
        data
      }))(error)
    : {
        message: 'Something went wrong, sorry!',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {}
      }

  // console.log(error.message)
  res.status(clientError.status).send(clientError)
}

const PROXY_APP_PORT = process.env.PROXY_APP_PORT || 3000
const proxyApp = express()

proxyApp.set('trust proxy', '194.195.209.172')
proxyApp.disable('x-powered-by')
proxyApp.use(morgan('dev'))
proxyApp.use(helmet())
proxyApp.use(proxyRouter)
proxyApp.use(routeNotFound)
proxyApp.use(errorHandler)

proxyApp.listen(PROXY_APP_PORT)

const SSE_APP_PORT = process.env.SSE_APP_PORT || 3001
const sseApp = express()

sseApp.set('trust proxy', '194.195.209.172')
sseApp.disable('x-powered-by')
sseApp.use(helmet())
sseApp.use(compression())
sseApp.use(sseRouter)
sseApp.use(routeNotFound)
sseApp.use(errorHandler)

sseApp.listen(SSE_APP_PORT)
