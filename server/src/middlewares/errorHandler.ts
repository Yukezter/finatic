import { ErrorRequestHandler } from 'express'

import { CustomError } from '../errors'

const errorHandler: ErrorRequestHandler = (error, _, res): void => {
  const safeForClient = error instanceof CustomError
  const clientError = (({ status, code, message, data }) => ({
    status,
    code,
    message,
    data,
  }))(safeForClient ? error : new CustomError())

  res.status(clientError.status).send(clientError)

  console.log(error)
}

export default errorHandler
