import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cors from 'cors'

import { routeNotFound, errorHandler } from './middlewares'
import * as routes from './routes'

const API_APP_PORT = 8000
const apiApp = express()

apiApp.set('trust proxy', true)
apiApp.use(morgan('dev'))
apiApp.use(helmet())
apiApp.use(routes.api)
apiApp.get('/api/test', (_req, res) => {
  setTimeout(() => {
    res.send('wow')
  }, 5000)
})
apiApp.use(routeNotFound)
apiApp.use(errorHandler)

apiApp.listen(API_APP_PORT)

const SSE_APP_PORT = 8001
const sseApp = express()

sseApp.set('trust proxy', true)
sseApp.use(helmet())
sseApp.use(cors())
sseApp.use(compression())
sseApp.use('/sse', routes.sse)
sseApp.use(routeNotFound)
sseApp.use(errorHandler)

sseApp.listen(SSE_APP_PORT)
