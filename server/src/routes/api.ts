import { Router, RequestHandler, Request } from 'express'
import axios from 'axios'

import { api } from '../utils'
import { cacheResponse as cache } from '../middlewares'
import { ResourceNotFound } from '../errors'

const proxy = (source: keyof typeof api, path?: string | ((req: Request) => string)): RequestHandler => {
  return (req, res, next) => {
    const endpoint = typeof path === 'function' ? path(req) : path || req.originalUrl
    const url = api[source].url(endpoint)

    axios(url, { responseType: 'stream' })
      .then(({ data }) => {
        data.pipe(res)
      })
      .catch(({ response }) => {
        console.log(response.status, response.statusText)
        next(new ResourceNotFound())
      })
  }
}

const router = Router()

// Search
router.get('/search/:fragment', cache(30), proxy('iex'))

// Forex
router.get('/fx', cache(1200), proxy('iex', '/fx/latest?symbols=EURUSD,GBPUSD,USDJPY,AUDUSD,USDCAD,USDCNY'))

// Crypto
router.get('/crypto/:symbol/quote', cache(30), proxy('iex'))

// Commodities
router.get('/commodities/oil', cache(86400), proxy('iex', '/data-points/market/DCOILWTICO'))
router.get('/commodities/gas', cache(86400), proxy('iex', '/data-points/market/GASREGCOVW'))
router.get('/commodities/jet-fuel', cache(86400), proxy('iex', '/data-points/market/DJFUELUSGULF'))

// Treasury Rates
router.get('treasury-rates/1', cache(86400), proxy('iex', '/data-points/market/DGS1'))
router.get('treasury-rates/5', cache(86400), proxy('iex', '/data-points/market/DGS5'))
router.get('treasury-rates/10', cache(86400), proxy('iex', '/data-points/market/DGS10'))

// Consumer Price Index
router.get('/economy/cpi', cache(86400), proxy('iex', '/data-points/market/CPIAUCSL'))

// Industrial Production Index
router.get('/economy/ipi', cache(86400), proxy('iex', '/data-points/market/INDPRO'))

// Real Gross Domestic Product
router.get('/economy/real-gdp', cache(86400), proxy('iex', '/data-points/market/A191RL1Q225SBEA'))

// Unemployment Rate
router.get('/economy/unemployment-rate', cache(86400), proxy('iex', '/data-points/market/UNRATE'))

// US Recession Probability
router.get('/economy/recession-probability', cache(86400), proxy('iex', '/data-points/market/RECPROUSM156N'))

// Market Movers
router.get('/market-movers/mostactive', cache(5 * 60), proxy('iex', '/stock/market/list/mostactive'))
router.get('/market-movers/gainers', cache(5 * 60), proxy('iex', '/stock/market/list/gainers'))
router.get('/market-movers/losers', cache(5 * 60), proxy('iex', '/stock/market/list/losers'))

const queryParams = (paramsObject: { [key: string]: string }): string => {
  return `?${new URLSearchParams(paramsObject).toString()}`
}

// News
router.get(
  '/news',
  cache(24 * 60 * 60),
  proxy('finnhub', req => `${req.originalUrl}${queryParams({ category: 'general' })}`)
)

// Stock Quote
router.get(
  '/stock/:symbol/quote',
  cache(10),
  proxy(
    'iex',
    req =>
      `${req.originalUrl}${queryParams({
        displayPercent: 'true',
        filter: 'latestPrice,change,changePercent,extendedChange,extendedChangePercent',
      })}`
  )
)

// Stock Chart - Intraday
router.get(
  '/stock/:symbol/chart/1d',
  cache(60),
  proxy(
    'iex',
    req =>
      `/stock/${req.params.symbol}/intraday-prices${queryParams({
        chartIEXOnly: 'true',
        filter: 'minute,average',
        chartInterval: '5',
      })}`
  )
)

// Stock Chart - Intraday (Last Price)
router.get(
  '/stock/:symbol/chart/1d/last',
  cache(60),
  proxy(
    'iex',
    req =>
      `/stock/${req.params.symbol}/intraday-prices${queryParams({
        chartIEXOnly: 'true',
        filter: 'minute,average',
        chartLast: '1',
      })}`
  )
)

// Stock Chart - 5 Day
router.get(
  '/stock/:symbol/chart/5d',
  cache(10 * 60),
  proxy(
    'iex',
    req =>
      `/stock/${req.params.symbol}/chart/5dm${queryParams({
        includeToday: 'true',
        chartIEXOnly: 'true',
        filter: 'date,minute,average',
      })}`
  )
)

// Stock Chart - 1 Month
router.get(
  '/stock/:symbol/chart/1m',
  cache(10 * 60),
  proxy(
    'iex',
    req =>
      `${req.originalUrl}${queryParams({
        includeToday: 'true',
        chartIEXOnly: 'true',
        filter: 'date,close',
      })}`
  )
)

// Stock Chart - 3 Months
router.get(
  '/stock/:symbol/chart/3m',
  cache(10 * 60),
  proxy(
    'iex',
    req =>
      `${req.originalUrl}${queryParams({
        includeToday: 'true',
        chartIEXOnly: 'true',
        filter: 'date,close',
      })}`
  )
)

// Stock Chart - 1 Year
router.get(
  '/stock/:symbol/chart/1y',
  cache(10 * 60),
  proxy(
    'iex',
    req =>
      `${req.originalUrl}${queryParams({
        includeToday: 'true',
        chartIEXOnly: 'true',
        filter: 'date,close',
      })}`
  )
)

// Company Info
router.get('/stock/:symbol/company', cache(), proxy('iex'))

// Company Stats
router.get('/stock/:symbol/stats', cache(), proxy('iex'))

// Company Recommendation
router.get(
  '/stock/:symbol/recommendation',
  cache(24 * 60 * 60),
  proxy('finnhub', req => `${req.originalUrl}${queryParams({ symbol: req.params.symbol })}`)
)

// Company News
router.get(
  '/stock/:symbol/news/last/:last',
  cache(),
  proxy('iex', req => `${req.originalUrl}${queryParams({ language: 'en' })}`)
)

// Peers
router.get('/stock/:symbol/peers', cache(12 * 60 * 60), proxy('iex'))

export default router
