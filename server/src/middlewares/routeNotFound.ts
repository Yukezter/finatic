import { RequestHandler } from 'express'
import { NotFound } from '../errors'

const routeNotFound: RequestHandler = (req, _res, next): void => {
  next(new NotFound(`${req.originalUrl} does not exist!`))
}

export default routeNotFound
