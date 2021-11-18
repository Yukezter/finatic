import { Router, RequestHandler, Request } from 'express'

import iex from '../iex'
import { cacheResponse as cache } from '../middlewares'

const router = Router()

export type ProxyOptions = {
  middleware?: RequestHandler | RequestHandler[]
  rewrite?: string | ((req: Request) => string)
  params?: { [key: string]: any } | ((req: Request) => { [key: string]: any })
}

export const getEndpoint = (req: Request, { rewrite }: ProxyOptions): string => {
  if (typeof rewrite === 'function') {
    return rewrite(req)
  }

  console.log('what the heck!!!', req.path)

  return rewrite || req.path
}

const proxy = (route: string, options: ProxyOptions = {}) => {
  let { middleware = [] } = options

  middleware = Array.isArray(middleware) ? middleware : [middleware]

  router.get(route, ...middleware, async (req, res, next) => {
    try {
      let { params = {} } = options

      if (typeof params === 'function') {
        params = params(req)
      }

      const endpoint = getEndpoint(req, options)
      const response = await iex.api(endpoint, { params })

      response.data.pipe(res)
    } catch (err) {
      next(err)
    }
  })
}

/* API endpoints */

// Ref symbols
proxy('/ref-data/symbols')

// Next trade date
proxy('/next-trade-date', { rewrite: '/ref-data/us/dates/trade/next' })

// Next holiday date
proxy('/next-holiday-date', { rewrite: '/ref-data/us/dates/holiday/next' })

// Search
proxy('/search/:fragment', { middleware: cache(30) })

// Market status
proxy('/market-status', {
  rewrite: '/stock/AAPL/quote',
  params: { filter: 'isUSMarketOpen' },
})

// Commodities
proxy('/commodities/oil', {
  rewrite: '/time-series/energy/DCOILWTICO',
  middleware: cache(24 * 60 * 60),
})

proxy('/commodities/natural-gas', {
  rewrite: '/time-series/energy/DHHNGSP',
  middleware: cache(24 * 60 * 60),
})

proxy('/commodities/heating-oil', {
  rewrite: '/time-series/energy/DHOILNYH',
  middleware: cache(24 * 60 * 60),
})

proxy('/commodities/diesel', {
  rewrite: '/time-series/energy/GASDESW',
  middleware: cache(24 * 60 * 60),
})

proxy('/commodities/gas', {
  rewrite: '/time-series/energy/GASREGCOVW',
  middleware: cache(24 * 60 * 60),
})

proxy('/commodities/propane', {
  rewrite: '/time-series/energy/DPROPANEMBTX',
  middleware: cache(24 * 60 * 60),
})

// Treasury rates
proxy('treasury-rates/1', {
  rewrite: '/data-points/market/DGS1',
  middleware: cache(24 * 60 * 60),
})

proxy('treasury-rates/5', {
  rewrite: '/data-points/market/DGS5',
  middleware: cache(24 * 60 * 60),
})

proxy('treasury-rates/10', {
  rewrite: '/data-points/market/DGS10',
  middleware: cache(24 * 60 * 60),
})

// Consumer price index
proxy('/economy/cpi', {
  rewrite: '/data-points/market/CPIAUCSL',
  middleware: cache(24 * 60 * 60),
})

// Industrial production index
proxy('/economy/ipi', {
  rewrite: '/data-points/market/INDPRO',
  middleware: cache(24 * 60 * 60),
})

// Real gross domestic product
proxy('/economy/real-gdp', {
  rewrite: '/data-points/market/A191RL1Q225SBEA',
  middleware: cache(24 * 60 * 60),
})

// Federal fund rates
proxy('/economy/federal-funds', {
  rewrite: '/data-points/market/FEDFUNDS',
  middleware: cache(24 * 60 * 60),
})

// Unemployment rate
proxy('/economy/unemployment-rate', {
  rewrite: '/data-points/market/UNRATE',
  middleware: cache(24 * 60 * 60),
})

// US recession probability
proxy('/economy/recession-probability', {
  rewrite: '/data-points/market/RECPROUSM156N',
  middleware: cache(24 * 60 * 60),
})

// Sector performance
proxy('/sector-performance', {
  rewrite: '/stock/market/sector-performance',
  middleware: cache(60 * 60),
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

// Market news
proxy('/market/news', {
  rewrite: '/stock/market/news',
  params: { last: 25 },
  middleware: cache(24 * 60 * 60),
})

const yyyymmdd = (date: Date): string => {
  const yyyy = date.getFullYear()
  let mm: number | string = date.getMonth() + 1
  mm = (mm > 9 ? '' : '0') + mm
  let dd: number | string = date.getDate()
  dd = (dd > 9 ? '' : '0') + dd
  return `${yyyy}${mm}${dd}`
}

// Market upcoming earnings
proxy('/stock/market/upcoming-earnings', {
  params: () => {
    const date = new Date()
    const from = yyyymmdd(date)
    date.setMonth(date.getMonth() + 1)
    const to = yyyymmdd(date)
    return {
      includeToday: true,
      fullUpcomingEarnings: true,
      next: 25,
      // from,
      // to,
    }
  },
  middleware: cache(60 * 60),
})

// Company info
proxy('/stock/:symbol/company', { middleware: cache(60 * 60) })

// Company stats
proxy('/stock/:symbol/stats', { middleware: cache(60 * 60) })

// Company peers
proxy('/stock/:symbol/peers', { middleware: cache(60 * 60) })

// Company upcoming earnings
proxy('/stock/:symbol/upcoming-earnings', {
  params: { includeToday: true, fullUpcomingEarnings: true },
  middleware: cache(60 * 60),
})

// Company past earnings
proxy('/stock/:symbol/past-earnings', {
  rewrite: ({ params }) => `/stock/${params.symbol}/earnings/4`,
  middleware: cache(60 * 60 * 24),
})

// Company news
proxy('/stock/:symbol/news', {
  rewrite: ({ path }) => `${path}/last/5`,
  params: { language: 'en' },
  middleware: cache(60 * 60),
})

// Stock quote
proxy('/stock/:symbol/quote', {
  params: {
    filter: 'latestPrice,change,changePercent,extendedChange,extendedChangePercent,isUSMarketOpen',
    displayPercent: true,
  },
  middleware: cache(10),
})

// Stock chart - intraday
proxy('/stock/:symbol/chart/1d', {
  rewrite: ({ params }) => `/stock/${params.symbol}/intraday-prices`,
  params: {
    filter: 'minute,average,marketAverage,close,marketClose',
    chartInterval: '5',
    chartIEXWhenNull: true,
  },
  middleware: cache(5),
})

// Stock chart - intraday (last price)
proxy('/stock/:symbol/chart/1d/last', {
  rewrite: ({ params }) => `/stock/${params.symbol}/intraday-prices`,
  params: {
    filter: 'minute,average,marketAverage,close,marketClose',
    chartIEXWhenNull: true,
    chartLast: 1,
  },
  middleware: cache(60 * 60),
})

// Stock chart - 5 day
proxy('/stock/:symbol/chart/5d', {
  rewrite: ({ params }) => `/stock/${params.symbol}/chart/5dm`,
  params: { includeToday: true, filter: 'date,minute,average' },
  middleware: cache(60 * 5),
})

// Stock chart - 1 month
proxy('/stock/:symbol/chart/1m', {
  params: { includeToday: true, filter: 'date,close' },
  middleware: cache(10 * 60),
})

// Stock chart - 3 months
proxy('/stock/:symbol/chart/3m', {
  params: { includeToday: true, filter: 'date,close' },
  middleware: cache(10 * 60),
})

// Stock chart - 1 year
proxy('/stock/:symbol/chart/1y', {
  params: { includeToday: true, filter: 'date,close' },
  middleware: cache(10 * 60),
})

export default router
