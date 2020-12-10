import { Request, Response, NextFunction } from 'express'

import * as client from '../redisClient'

export const getCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const cached = await client.GET(req.originalUrl)

  if (cached) {
    res.send(JSON.parse(cached))
    return
  }

  next()
}

export const setCache = async (req: Request, res: Response): Promise<any> => {
  await client.SET(req.originalUrl, JSON.stringify(res.locals.data))
}
