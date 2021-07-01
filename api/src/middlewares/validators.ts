import { RequestHandler } from 'express'

import { IncorrectValues } from '../Errors'

export const validateParams = (searchParamsString: string | string[] = ''): RequestHandler => {
  return (req, _res, next) => {
    const reqSearchParams = new URLSearchParams(req.query as any)
    const reqSearchParamsString = decodeURIComponent(reqSearchParams.toString())

    if (Array.isArray(searchParamsString)) {
      if (!searchParamsString.some(s => reqSearchParamsString === s)) {
        return next(new IncorrectValues('Invalid query parameters.'))
      }
    } else if (searchParamsString !== reqSearchParamsString) {
      return next(new IncorrectValues('Invalid query parameters.'))
    }

    next()
  }
}

export const validateSymbols: RequestHandler = (req, _res, next) => {
  if (typeof req.query.symbols !== 'string' || !req.query.symbols) {
    return next(new IncorrectValues('Invalid symbols.'))
  }

  next()
}
