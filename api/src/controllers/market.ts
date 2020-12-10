import { Request, Response, NextFunction } from 'express'
import { chunk } from 'lodash'

import * as iex from '../iex'
import sleep from '../utils/sleep'

const BATCH_SIZE = 5

const requestDataPoint = async (key: string, description: string): Promise<any> => {
  const dataPoint = await iex.dataPoint(key)

  return {
    description,
    dataPoint,
  }
}

const getDataPoints = async (dataPointKeys: any[]): Promise<any> => {
  const dataPoints = []

  const requests = dataPointKeys.map((v) => requestDataPoint(v.key, v.description))
  const chunkedRequests = chunk(requests, BATCH_SIZE)

  for (let i = 0; i < chunkedRequests.length; i++) {
    await sleep(5)

    const responses = await Promise.all(chunkedRequests[i])
    dataPoints.push(...responses)
  }

  return dataPoints
}

export const getMarketData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const earningsToday = await iex.earningsToday()

  await sleep(5)

  const top10ListsResolved = await Promise.all([
    iex.list('mostactive'),
    iex.list('gainers'),
    iex.list('losers'),
  ])

  const top10Lists = {
    mostActive: top10ListsResolved[0],
    gainers: top10ListsResolved[1],
    losers: top10ListsResolved[2],
  }

  await sleep(5)

  const sectorPerformance = await iex.sectorPerformance()

  const dataPoints: any = {}
  dataPoints.economy = await getDataPoints(iex.dataPointKeys.economy)
  dataPoints.treasuries = await getDataPoints(iex.dataPointKeys.treasuries)
  dataPoints.commodities = await getDataPoints(iex.dataPointKeys.commodities)

  const data = {
    earningsToday,
    top10Lists,
    sectorPerformance,
    dataPoints,
  }

  console.log(data)

  res.send(data)

  res.locals.data = data
  next()
}
