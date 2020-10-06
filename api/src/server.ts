import 'dotenv/config'
import express from 'express'

import routes from './routes'
import * as errorHanders from './middleware/errorHandlers'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use('/api', routes)

app.use(errorHanders.routeNotFound)
app.use(errorHanders.main)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
