import { RequestHandler } from 'express'

import { IncorrectValues } from '../errors'

const validateSymbols: RequestHandler = (req, _res, next) => {
  if (!req.query.symbols || typeof req.query.symbols !== 'string') {
    next(new IncorrectValues('Invalid symbols.'))
  } else {
    next()
  }
}

export default validateSymbols
