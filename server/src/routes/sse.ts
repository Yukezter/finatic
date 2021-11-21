import { Router } from 'express'

import iex from '../iex'
import { NoSymbol } from '../errors'
import { getEndpoint, ProxyOptions } from './api'

const router = Router()

const proxySSE = (route: string, options: ProxyOptions = {}) => {
  let { middleware = [] } = options

  middleware = Array.isArray(middleware) ? middleware : [middleware]

  router.get(route, ...middleware, async (req, res, next) => {
    try {
      let { params = {} } = options

      if (typeof params === 'function') {
        params = params(req)
      }

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

/* SSE endpoints */

// Stock quotes
proxySSE('/stock/quote', {
  rewrite: '/stocksUSNoUTP1Second',
  params: req => ({ symbols: req.query.symbols }),
  middleware: (req, res, next) => {
    try {
      if (!req.query.symbols) {
        throw new NoSymbol()
      }

      if (req.query.symbols && typeof req.query.symbols === 'string') {
        req.query.symbols = req.query.symbols
          .split(',', 25)
          .filter(symbol => symbol)
          .join(',')
      }

      next()
    } catch (err) {
      next(err)
    }
  },
})

// Crypto quotes
proxySSE('/cryptos', {
  rewrite: '/cryptoQuotes',
  params: {
    symbols: [
      'BTCUSD',
      'ETHUSD',
      'LTCUSD',
      'ADAUSDT',
      'SOLUSDT',
      'SHIBUSDT',
      'DOGEUSDT',
      'ALGOUSDT',
      'XLMUSDT',
      'XRPUSDT',
    ].join(','),
  },
})

// Forex quotes
proxySSE('/forex', {
  rewrite: '/forex1Minute',
  params: {
    symbols: [
      'EURUSD',
      'GBPUSD',
      'USDJPY',
      'AUDUSD',
      'USDCAD',
      'USDCHF',
      'USDHKD',
      'NZDUSD',
    ].join(','),
  },
})

export default router
