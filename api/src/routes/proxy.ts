import { Request, Response } from 'express'
import Router from 'express-promise-router'
import Bottleneck from 'bottleneck'
import axios, { AxiosError } from 'axios'

import { cacheRes as cache } from '../middlewares'
import { ResourceNotFound } from '../Errors'

const router = Router()

const IEX_BASE_URL = 'https://cloud.iexapis.com'
const { IEX_TOKEN = '' } = process.env

const apiLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50
})

const fetch = apiLimiter.wrap((url: string) => {
  return axios(url, { responseType: 'stream' })
})

const getURL = (path: string): string => {
  const url = new URL(`/stable${path}`, IEX_BASE_URL)
  url.searchParams.append('token', IEX_TOKEN)
  return url.href
}

const proxy = async (req: Request, res: Response): Promise<void> => {
  const response = await fetch(getURL(req.originalUrl)).catch((error: AxiosError) => {
    console.log(error.code, error.message)
    throw new ResourceNotFound()
  })

  response.data.pipe(res)
}

// Search
router.use('/stock/search/:fragment', cache(5 * 60), proxy)

// Forex
router.use('/fx/latest', cache(60, { includeParams: true }), proxy)

// Crypto
router.use('/crypto/:symbol(btcusd|ethusd|ltcusd)/quote', cache(30), proxy)

// Economic Data
router.use(`/data-points/market/DCOILWTICO`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/GASREGCOVW`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/DJFUELUSGULF`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/DGS1`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/DGS5`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/DGS10`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/CPIAUCSL`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/TERMCBCCALLNS`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/A191RL1Q225SBEA`, cache(24 * 60 * 60), proxy)
router.use(`/data-points/market/RECPROUSM156N`, cache(24 * 60 * 60), proxy)

// Market Lists
router.use('/stock/market/list/:type(mostactive|gainers|losers)', cache(10), proxy)

// News
router.use('/news', cache(10), proxy)

// Stock Data
router.use('/stock/:symbol/quote', cache(5), proxy)
router.use('/stock/:symbol/intraday-prices', cache(5 * 60), proxy)
router.use('/stock/:symbol/chart/5dm', cache(5 * 60), proxy)
router.use('/stock/:symbol/chart/1m', cache(12 * 60 * 60), proxy)
router.use('/stock/:symbol/chart/3m', cache(12 * 60 * 60), proxy)
router.use('/stock/:symbol/chart/1y', cache(12 * 60 * 60), proxy)
router.use('/stock/:symbol/company', cache(), proxy)
router.use('/stock/:symbol/stats', cache(), proxy)

export default router
