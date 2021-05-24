import { RequestHandler, Request, Response, NextFunction } from 'express'

import { RouteNotFoundError } from '.'

export const routeNotFound: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new RouteNotFoundError(req.originalUrl))
}
