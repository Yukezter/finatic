import { RequestHandler } from 'express'
import { RouteNotFound } from '../errors'

const routeNotFound: RequestHandler = (req, _res, next): void => {
  next(new RouteNotFound(req.originalUrl))
}

export default routeNotFound
