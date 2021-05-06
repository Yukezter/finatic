import 'dotenv/config'
import express from 'express'
import ip from 'ip'

import { routeNotFound } from './middleware'
import { logErrors, errorHandler } from './errors'
import routes from './routes'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use('/api', routes)
app.use(routeNotFound)
app.use(logErrors)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on http://${ip.address()}:${PORT}`)
})
