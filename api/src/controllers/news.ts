import { Request, Response, NextFunction } from 'express'

// import { CustomError } from '../errors'
import * as iex from '../iex'

export const getNews = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const data = await iex.news()

  res.locals.data = data
  next()
}

export const getCompanyNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { symbol, last } = req.params
  const data = await iex.news(last, symbol)

  res.locals.data = data
  next()
}
