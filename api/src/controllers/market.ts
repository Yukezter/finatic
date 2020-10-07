import { Request, Response, NextFunction } from 'express'
import { chunk } from 'lodash'

import * as iex from '../iex'
import sleep from '../utils/sleep'

const BATCH_SIZE = 5

const requestDataPoint = async (key: string, description: string): Promise<any> => {
  const dataPoint = await iex.dataPoint(key)

  return {
    description,
    dataPoint
  }
}

const getDataPoints = async (dataPointKeys: any[]): Promise<any> => {
  const dataPoints = []

  const requests = dataPointKeys.map(v => requestDataPoint(v.key, v.description))
  const chunkedRequests = chunk(requests, BATCH_SIZE)

  for (let i = 0; i < chunkedRequests.length; i++) {
    await sleep(5)

    const responses = await Promise.all(chunkedRequests[i])
    dataPoints.push(...responses)
  }

  return dataPoints
}

export const getMarketData = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const mostActive = await iex.list('mostactive')

  await sleep(5)

  const sectorPerformance = await iex.sectorPerformance()

  const dataPoints: any = {}
  dataPoints.economy = await getDataPoints(iex.dataPointKeys.economy)
  dataPoints.tresuries = await getDataPoints(iex.dataPointKeys.tresuries)
  dataPoints.commodities = await getDataPoints(iex.dataPointKeys.commodities)

  const data = {
    mostActive,
    sectorPerformance,
    dataPoints
  }

  res.send(data)

  // cache
  res.locals.data = data
  next()
}
