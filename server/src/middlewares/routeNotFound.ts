import { RequestHandler } from 'express'
import { NotFound } from '../errors'

const routeNotFound: RequestHandler = (req, res, next): void => {
  next(new NotFound())
}

export default routeNotFound
