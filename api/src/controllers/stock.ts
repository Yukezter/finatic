import { Request, Response, NextFunction } from 'express'

// import { CustomError } from '../errors'
import sleep from '../utils/sleep'
import * as iex from '../iex'

export const getPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { symbol } = req.params
  const data = await iex.price(symbol)

  res.locals.data = data
  next()
}

export const getQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { symbol } = req.params
  const data = await iex.quote(symbol)

  res.locals.data = data
  next()
}

export const getChartData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { symbol, range } = req.params
  let data = await iex.chart(symbol, range)

  data = data.map((bucket: any) => ({
    x: new Date(`${bucket.date as string} ${(bucket.minute as number) || ''}`),
    y: bucket.close || null
  }))

  res.locals.data = data
  next()
}

export const getStockData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { symbol } = req.params
  const batch = await iex.batch(symbol)

  // await sleep(10)

  // const estimates = await iex.estimates(symbol)

  await sleep(10)

  const news = await iex.news(10, symbol)

  res.locals.data = {
    quote: batch.quote,
    stats: batch['advanced-stats'],
    company: batch.company,
    // ratings: batch['recommendation-trends'],
    // earnings: batch.earnings.earnings,
    // estimates: estimates.estimates,
    news
  }

  next()
}
