import { Router, RequestHandler, Request } from 'express'

import iex from './iex'
import { cacheResponse as cache } from './middlewares'

const router = Router()

type ProxyOptions = {
  middleware?: RequestHandler | RequestHandler[]
  rewrite?: string | ((req: Request) => string)
  params?: { [key: string]: any }
}

// eslint-disable-next-line no-shadow
const getEndpoint = (req: Request, { rewrite }: ProxyOptions): string => {
  if (typeof rewrite === 'function') {
    return rewrite(req)
  }

  return rewrite || req.originalUrl
}

const proxy = (route: string, options: ProxyOptions) => {
  let { middleware = [] } = options
  const { params = {} } = options

  middleware = Array.isArray(middleware) ? middleware : [middleware]

  router.get(route, ...middleware, async (req, res, next) => {
    try {
      const endpoint = getEndpoint(req, options)
      const response = await iex.api(endpoint, { params })
      response.data.pipe(res)
    } catch (err) {
      next(err)
    }
  })
}

interface ProxySSEOptions extends Omit<ProxyOptions, 'middleware'> {
  allowReqParams?: string[]
}

const proxySSE = (route: string, options: ProxySSEOptions) => {
  const { allowReqParams = [], params = {} } = options

  router.get(`/sse${route}`, async (req, res, next) => {
    try {
      allowReqParams.forEach(param => {
        if (param === 'symbols') {
          let { symbols } = req.query
          if (symbols && typeof symbols === 'string') {
            symbols = symbols.split(',', 25).filter(symbol => !symbol)
          }

          // eslint-disable-next-line no-param-reassign
          params.symbols = symbols
        } else {
          params[param] = req.query[param]
        }
      })

      const endpoint = getEndpoint(req, options)
      const response = await iex.sse(endpoint, { params })

      res.header({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      })

      response.data.pipe(res)
    } catch (err) {
      next(err)
    }
  })
}

/* API endpoints */

// Next trade date
proxy('/next-trade-date', { rewrite: '/ref-data/us/dates/trade/next' })

// Next holiday date
proxy('/next-trade-date', { rewrite: '/ref-data/us/dates/holiday/next' })

// Search
proxy('/search/:fragment', { middleware: cache(30) })

// Market status
proxy('/market-status', {
  rewrite: '/stock/AAPL/quote',
  params: { filter: 'isUSMarketOpen' },
})

// Sector performance
proxy('/sector-performance', {
  rewrite: '/stock/market/sector-performance',
  middleware: cache(60 * 60),
})

// Commodities
proxy('/commodities/oil', {
  rewrite: '/time-series/energy/DCOILWTICO',
  middleware: cache(86400),
})

proxy('/commodities/natural-gas', {
  rewrite: '/time-series/energy/DHHNGSP',
  middleware: cache(86400),
})

proxy('/commodities/heating-oil', {
  rewrite: '/time-series/energy/DHOILNYH',
  middleware: cache(86400),
})

proxy('/commodities/diesel', {
  rewrite: '/time-series/energy/GASDESW',
  middleware: cache(86400),
})

proxy('/commodities/gas', {
  rewrite: '/time-series/energy/GASREGCOVW',
  middleware: cache(86400),
})

proxy('/commodities/propane', {
  rewrite: '/time-series/energy/DPROPANEMBTX',
  middleware: cache(86400),
})

// Treasury rates
proxy('treasury-rates/1', {
  rewrite: '/data-points/market/DGS1',
  middleware: cache(86400),
})

proxy('treasury-rates/5', {
  rewrite: '/data-points/market/DGS5',
  middleware: cache(86400),
})

proxy('treasury-rates/10', {
  rewrite: '/data-points/market/DGS10',
  middleware: cache(86400),
})

// Consumer price index
proxy('/economy/cpi', {
  rewrite: '/data-points/market/CPIAUCSL',
  middleware: cache(86400),
})

// Industrial production index
proxy('/economy/ipi', {
  rewrite: '/data-points/market/INDPRO',
  middleware: cache(86400),
})

// Real gross domestic product
proxy('/economy/real-gdp', {
  rewrite: '/data-points/market/A191RL1Q225SBEA',
  middleware: cache(86400),
})

// Federal fund rates
proxy('/economy/federal-funds', {
  rewrite: '/data-points/market/FEDFUNDS',
  middleware: cache(86400),
})

// Unemployment rate
proxy('/economy/unemployment-rate', {
  rewrite: '/data-points/market/UNRATE',
  middleware: cache(86400),
})

// US recession probability
proxy('/economy/recession-probability', {
  rewrite: '/data-points/market/RECPROUSM156N',
  middleware: cache(86400),
})

// Market movers
proxy('/market-movers/mostactive', {
  rewrite: '/stock/market/list/mostactive',
  middleware: cache(5 * 60),
})

proxy('/market-movers/gainers', {
  rewrite: '/stock/market/list/gainers',
  middleware: cache(5 * 60),
})

proxy('/market-movers/losers', {
  rewrite: '/stock/market/list/losers',
  middleware: cache(5 * 60),
})

// Company info
proxy('/stock/:symbol/company', { middleware: cache(60 * 60) })

// Company stats
proxy('/stock/:symbol/stats', { middleware: cache(60 * 60) })

// Peers
proxy('/stock/:symbol/peers', { middleware: cache(60 * 60) })

// Company next earnings
proxy('/stock/:symbol/upcoming-earnings', { middleware: cache(60 * 60) })

// Company earnings
proxy('/stock/:symbol/earnings', {
  rewrite: ({ originalUrl }) => `${originalUrl}/4`,
  middleware: cache(60 * 60 * 24),
})

// Company news
proxy('/stock/:symbol/news', {
  rewrite: ({ originalUrl }) => `${originalUrl}/last/5`,
  params: { language: 'en' },
  middleware: cache(60 * 60),
})

// News
proxy('/news', {
  rewrite: '/stock/market/list/losers',
  params: { range: 'yesterday', limit: '5' },
  middleware: cache(24 * 60 * 60),
})

// Stock quote
const stockQuoteFilter = 'latestPrice,change,changePercent,extendedChange,extendedChangePercent'
proxy('/stock/:symbol/quote', {
  params: { displayPercent: 'true', filter: stockQuoteFilter },
  middleware: cache(10),
})

// Stock chart - intraday
proxy('/stock/:symbol/chart/1d', {
  middleware: cache(5),
  rewrite: ({ params }) => `/stock/${params.symbol}/intraday-prices`,
  params: { filter: 'minute,average', chartInterval: '5' },
})

// Stock chart - intraday (last price)
proxy('/stock/:symbol/chart/1d/last', {
  rewrite: ({ params }) => `/stock/${params.symbol}/intraday-prices`,
  params: { chartIEXOnly: 'true', filter: 'minute,average', chartLast: '1' },
  middleware: cache(60 * 60),
})

// Stock chart - 5 day
proxy('/stock/:symbol/chart/5d', {
  rewrite: ({ params }) => `/stock/${params.symbol}/chart/5dm`,
  params: { includeToday: 'true', filter: 'date,minute,average' },
  middleware: cache(60 * 5),
})

// Stock chart - 1 month
proxy('/stock/:symbol/chart/1m', {
  params: { includeToday: 'true', filter: 'date,close' },
  middleware: cache(10 * 60),
})

// Stock chart - 3 months
proxy('/stock/:symbol/chart/3m', {
  params: { includeToday: 'true', filter: 'date,close' },
  middleware: cache(10 * 60),
})

// Stock chart - 1 year
proxy('/stock/:symbol/chart/1y', {
  params: { includeToday: 'true', filter: 'date,close' },
  middleware: cache(10 * 60),
})

/* SSE endpoints */

proxySSE('/system-event', {
  rewrite: '/deep/?symbols=AAPL&channels=system-event',
})

// Stock quotes
proxySSE('/stock/quote', {
  rewrite: '/stocksUSNoUTP1Second',
  allowReqParams: ['symbol'],
})

// Crypto quotes
const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'LTCUSD', 'ADAUSDT', 'SOLUSDT', 'SHIBUSDT']
proxySSE('/cryptos', {
  rewrite: '/cryptoQuotes',
  params: { symbols: cryptoSymbols },
})

// Forex quotes
const fxSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF']
proxySSE('/forex', {
  rewrite: '/forex1Minute',
  params: { symbols: fxSymbols },
})

// IPOs
// router.get(
//   '/ipos',
//   cache(60),
//   p('finnhub', req => {
//     return `/calendar/ipo${queryParams({ from: req.query.from as string, to: req.query.to as string })}`
//   })
// )
export default router
