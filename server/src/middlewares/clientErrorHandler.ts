import { ErrorRequestHandler } from 'express'

import { CustomError } from '../errors'

const codes = [400, 404, 429, 500]

const clientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.response && codes.includes(err.response.status)) {
    const { status, statusText } = err.response
    next(new CustomError(status, statusText))
  } else {
    next(err)
  }
}

export default clientErrorHandler
