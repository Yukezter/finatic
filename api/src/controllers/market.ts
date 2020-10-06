import { Request, Response } from 'express'

import { client } from '../middleware/redis'
import * as api from '../iex'
import sleep from '../utils/sleep'
// import * as mock from '../mock'

client.set('123', 'wow')
client.get('123', (_error, value) => {
  console.log(value)
})

type MarketData = { [key: string]: any }

export const getMarketData = async (_req: Request, res: Response): Promise<any> => {
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('it worked')
  //   return res.send(mock.market)
  // }

  const data: MarketData = {}

  // const mostActive = await api.list('mostactive')
  // data.mostActive = mostActive.data

  // await sleep(5)

  // const sectorPerformance = await api.sectorPerformance()
  // data.sectorPerformance = sectorPerformance.data

  data.dataPoints = {}

  for (let index1 = 0; index1 < api.keyLists.length; index1++) {
    const { type, keys } = api.keyLists[index1]
    let requests = []
    data.dataPoints[type] = []

    for (let index2 = 0; index2 < keys.length; index2++) {
      const { key, description } = keys[index2]
      let responses

      requests.push(api.dataPoint(key))

      if (requests.length === 5) {
        await sleep(10)

        responses = await Promise.all(requests)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        data.dataPoints[type].push(
          ...responses.map((response) => ({
            description,
            data: response.data,
          })),
        )

        requests = []
      } else if (index2 === key.length - 1) {
        await sleep(10)

        responses = await Promise.all(requests)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        data.dataPoints[type].push(
          ...responses.map((response) => ({
            description,
            data: response.data,
          })),
        )
      }
    }
  }

  console.log(data.dataPoints)

  res.send(data)
}
