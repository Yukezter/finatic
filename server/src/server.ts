import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
// import cors from 'cors'

import { routeNotFound, clientErrorHandler, errorHandler } from './middlewares'
import apiRoutes from './routes/api'
import sseRoutes from './routes/sse'

const APP_PORT = 8000
const app = express()

app.set('trust proxy', true)
app.use(morgan('dev'))
app.use(helmet())
app.use('/api', apiRoutes)
app.use('/sse', sseRoutes)
app.use(routeNotFound)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(APP_PORT)
