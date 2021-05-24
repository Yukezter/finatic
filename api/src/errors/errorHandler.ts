import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'

import { CustomError } from './index'

export const errorHandler: ErrorRequestHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const safeForClient = error instanceof CustomError

  const clientError = safeForClient
    ? pick(error, ['message', 'code', 'status', 'data'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {}
      }

  console.log(error)
  res.status(clientError.status).send(clientError)
}
