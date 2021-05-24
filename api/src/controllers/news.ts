import { Request, Response, NextFunction } from 'express'

// import { CustomError } from '../errors'
import * as iex from '../iex'

export const getNews = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const data = await iex.marketNews('AAPL')

  res.locals.data = data
  next()
}
