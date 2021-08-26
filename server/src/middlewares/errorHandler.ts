import { ErrorRequestHandler } from 'express'

import { CustomError } from '../errors'

const errorHandler: ErrorRequestHandler = (error, _req, res): void => {
  const safeForClient = error instanceof CustomError
  const clientError = safeForClient
    ? (({ message, code, status, data }) => ({
        message,
        code,
        status,
        data,
      }))(error)
    : {
        message: 'Something went wrong, sorry!',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      }

  console.log(error.message)

  res.status(clientError.status).send(clientError)
}

export default errorHandler
