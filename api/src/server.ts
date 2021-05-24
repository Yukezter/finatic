import 'dotenv/config'
import http from 'http'
import morgan from 'morgan'
import compression from 'compression'
import httpProxy from 'http-proxy'
import express from 'express'
import rateLimit from 'express-rate-limit'
import Bottleneck from 'bottleneck'

import routes from './routes'
import { errorHandler, routeNotFound } from './errors'

export const proxy = httpProxy.createProxyServer({
  changeOrigin: true
})

const securityLayer = express()

securityLayer.use(
  rateLimit({
    windowMs: 1000,
    max: 10
  })
)

const bottleneck = new Bottleneck({
  minTime: 10,
  maxConcurrent: 1
})

const bottleneckRequests = bottleneck.wrap(() => Promise.resolve())

securityLayer.get('*', async (req, res) => {
  // proxy requests are at least 10ms apart
  await bottleneckRequests().catch(error => {
    console.log(error)
  })

  proxy.web(req, res, {
    target: 'http://localhost:3001'
  })
})

http.createServer(securityLayer).listen(3000)

const PORT = process.env.PORT || 3001
const app = express()

app.set('trust proxy', 1)

app.use(morgan('dev'))
app.use(compression())
app.use(express.json())

app.use(routes)
app.use(routeNotFound)
app.use(errorHandler)

const httpServer = http.createServer(app)

httpServer.listen(PORT, () => {
  console.log('Http server connected...')
})
