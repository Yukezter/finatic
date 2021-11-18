import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
// import cors from 'cors'

import { routeNotFound, clientErrorHandler, errorHandler } from './middlewares'
import apiRoutes from './routes/api'
import sseRoutes from './routes/sse'

const API_APP_PORT = 8000
const apiApp = express()

apiApp.set('trust proxy', true)
apiApp.use(morgan('dev'))
apiApp.use(helmet())
apiApp.use('/api', apiRoutes)
apiApp.use('/sse', sseRoutes)
apiApp.use(routeNotFound)
apiApp.use(clientErrorHandler)
apiApp.use(errorHandler)

apiApp.listen(API_APP_PORT)
