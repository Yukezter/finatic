import { Request, Response, NextFunction } from 'express'
// import { chunk } from 'lodash'

import * as iex from '../iex'
// import sleep from '../utils/sleep'

// const BATCH_SIZE = 5

// const requestDataPoint = async (key: string, description: string): Promise<any> => {
//   const dataPoint = await iex.dataPoint(key)

//   return {
//     description,
//     dataPoint,
//   }
// }

// const getDataPoints = async (dataPointKeys: any[]): Promise<any> => {
//   const dataPoints = []

//   const requests = dataPointKeys.map((v) => requestDataPoint(v.key, v.description))
//   const chunkedRequests = chunk(requests, BATCH_SIZE)

//   for (let i = 0; i < chunkedRequests.length; i++) {
//     await sleep(5)

//     const responses = await Promise.all(chunkedRequests[i])
//     dataPoints.push(...responses)
//   }

//   return dataPoints
// }

export const getList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const list = await iex.list(req.params.type)

  res.locals.data = list.map((stock: any) => ({
    ...stock,
    companyName: stock.companyName.replace(/ - Class [A-Z]$/, '')
  }))
  next()
}
