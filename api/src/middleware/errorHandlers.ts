import {
  ErrorRequestHandler,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express'
import { pick } from 'lodash'

import { CustomError, RouteNotFoundError } from '../errors'

export const main: ErrorRequestHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.log(error)

  const safeForClient = error instanceof CustomError

  const clientError = safeForClient
    ? pick(error, ['message', 'code', 'status', 'data'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      }

  res.status(clientError.status).send(clientError)
}

export const routeNotFound: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new RouteNotFoundError(req.originalUrl))
}
