import { ErrorRequestHandler } from 'express'

import { CustomError } from '../errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const safeForClient = err instanceof CustomError
  const clientError = (({ status, statusText, data }) => ({
    status,
    statusText,
    data,
  }))(safeForClient ? err : new CustomError())

  console.log(err)
  res.status(clientError.status).send(clientError)
}

export default errorHandler
