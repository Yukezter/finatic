import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
// import cors from 'cors'

import { routeNotFound, errorHandler } from './middlewares'
import routes from './routes'

const API_APP_PORT = 8000
const apiApp = express()

apiApp.set('trust proxy', true)
apiApp.use(morgan('dev'))
apiApp.use(helmet())
// apiApp.use(cors())
apiApp.use(routes)
apiApp.use(routeNotFound)
apiApp.use(errorHandler)

apiApp.listen(API_APP_PORT)
