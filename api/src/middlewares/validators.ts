import { RequestHandler } from 'express'

import { getIEXUrl, addToken } from '../iex'
import { IncorrectValues } from '../Errors'

export const validateParams = (search: string | string[] = ''): RequestHandler => {
  return (req, res, next) => {
    const url = getIEXUrl(req.originalUrl)
    const reqSearch = decodeURIComponent(url.search)

    if (Array.isArray(search)) {
      if (!search.some(s => s === reqSearch)) {
        return next(new IncorrectValues('Invalid query parameters.'))
      }
    } else if (search !== reqSearch) {
      return next(new IncorrectValues('Invalid query parameters.'))
    }

    res.locals.proxyUrl = addToken(url).href
    next()
  }
}

export const validateSymbols: RequestHandler = (req, _res, next) => {
  if (typeof req.query.symbols !== 'string' || !req.query.symbols) {
    return next(new IncorrectValues('Invalid symbols.'))
  }

  next()
}
