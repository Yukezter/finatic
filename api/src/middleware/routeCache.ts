import { Request, Response, NextFunction } from 'express'

import * as client from '../redisClient'

export const getCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const cached = await client.GET(req.originalUrl)

  if (cached) {
    return res.json(JSON.parse(cached))
  }

  next()
}

export const setCache = async (req: Request, res: Response): Promise<any> => {
  const { data } = res.locals
  res.json(data)
  await client.SET(req.originalUrl, JSON.stringify(data))
}
