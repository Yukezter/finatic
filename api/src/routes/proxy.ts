import { Router, RequestHandler } from 'express'
import axios from 'axios'

import { getIEXUrl, getFinnhubUrl } from '../apis'
import { validateParams as params, cacheRes as cache } from '../middlewares'
import { ResourceNotFound } from '../Errors'

const router = Router()

const iexProxy: RequestHandler = (req, res, next) => {
  axios(getIEXUrl(req.originalUrl), { responseType: 'stream' })
    .then(({ data }) => {
      data.pipe(res)
    })
    .catch(({ response }) => {
      console.log(response.status, response.statusText)
      if (response && [400, 404, 429].indexOf(response.status) !== -1) {
        res.status(response.status)
        response.data.pipe(res)
      } else {
        next(new ResourceNotFound())
      }
    })
}

const finnhubProxy: RequestHandler = (req, res, next) => {
  axios(getFinnhubUrl(req.originalUrl), { responseType: 'stream' })
    .then(({ data }) => {
      data.pipe(res)
    })
    .catch(({ response }) => {
      if (response) {
        console.log(response.status, response.statusText)
      }

      next(new ResourceNotFound())
    })
}

// Search
router.get('/search/:fragment', params(), cache(5 * 60), iexProxy)

// Forex
router.get('/fx/latest', params('symbols=EURUSD,GBPUSD,USDJPY'), cache(1200), iexProxy)

// Crypto
router.get('/crypto/btcusd/quote', params(), cache(30), iexProxy)
router.get('/crypto/ethusd/quote', params(), cache(30), iexProxy)
router.get('/crypto/ltcusd/quote', params(), cache(30), iexProxy)

// Economic Data
router.get(`/data-points/market/DCOILWTICO`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/GASREGCOVW`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/DJFUELUSGULF`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/DGS1`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/DGS5`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/DGS10`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/CPIAUCSL`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/TERMCBCCALLNS`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/A191RL1Q225SBEA`, params(), cache(24 * 60 * 60), iexProxy)
router.get(`/data-points/market/RECPROUSM156N`, params(), cache(24 * 60 * 60), iexProxy)

// Market Lists
router.get('/stock/market/list/mostactive', params(), cache(5 * 60), iexProxy)
router.get('/stock/market/list/gainers', params(), cache(5 * 60), iexProxy)
router.get('/stock/market/list/losers', params(), cache(5 * 60), iexProxy)

// News
router.get('/news', params('category=general'), cache(24 * 60 * 60), finnhubProxy)

// Stock Data
router.get('/stock/:symbol/quote', params(), cache(5 * 60), iexProxy)
router.get(
  '/stock/:symbol/intraday-prices',
  params([
    'chartIEXOnly=true&filter=minute,average&chartInterval=5',
    'chartIEXOnly=true&filter=minute,average&chartInterval=10'
  ]),
  cache(10 * 60),
  iexProxy
)
router.get(
  '/stock/:symbol/chart/5dm',
  params('includeToday=true&chartIEXOnly=true&filter=date,minute,average'),
  cache(10 * 60),
  iexProxy
)
router.get(
  '/stock/:symbol/chart/1m',
  params('includeToday=true&chartCloseOnly=true&filter=date,close'),
  cache(12 * 60 * 60),
  iexProxy
)
router.get(
  '/stock/:symbol/chart/3m',
  params('includeToday=true&chartCloseOnly=true&filter=date,close'),
  cache(12 * 60 * 60),
  iexProxy
)
router.get(
  '/stock/:symbol/chart/1y',
  params('includeToday=true&chartCloseOnly=true&filter=date,close'),
  cache(12 * 60 * 60),
  iexProxy
)
router.get('/stock/:symbol/company', params(), cache(), iexProxy)
router.get('/stock/:symbol/stats', params(), cache(), iexProxy)
router.get('/stock/recommendation', cache(24 * 60 * 60), finnhubProxy)
router.get('/stock/:symbol/news/last/:last', params('language=en'), cache(), iexProxy)
router.get('/stock/:symbol/peers', params(), cache(12 * 60 * 60), iexProxy)

export default router
