// import { NextFunction, Request, Response } from 'express'
// import httpProxy from 'http-proxy'
import Router from 'express-promise-router'

import { routeCache } from '../middlewares'
import { proxy } from '../iex'

const router = Router()
const cache = routeCache.middleware

// Search
router.use('/stock/search/:fragment', cache(5 * 60), proxy)

// Forex
router.use('/fx/latest', cache(60, { includeParams: true }), proxy)

// Crypto
router.use('/crypto/btcusd/quote', cache(30), proxy)
router.use('/crypto/ethusd/quote', cache(30), proxy)
router.use('/crypto/ltcusd/quote', cache(30), proxy)

// Economic Data
router.use(`/data-points/market/DCOILWTICO`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/GASREGCOVW`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/DJFUELUSGULF`, cache(7 * 24 * 60 * 60), proxy)
router.use(`/data-points/market/DGS1`, cache(), proxy)
router.use(`/data-points/market/DGS5`, cache(), proxy)
router.use(`/data-points/market/DGS10`, cache(), proxy)
router.use(`/data-points/market/CPIAUCSL`, cache(), proxy)
router.use(`/data-points/market/TERMCBCCALLNS`, cache(), proxy)
router.use(`/data-points/market/A191RL1Q225SBEA`, cache(), proxy)
router.use(`/data-points/market/RECPROUSM156N`, cache(), proxy)

// Market Lists
router.use('/stock/market/list/mostactive', cache(10), proxy)
router.use('/stock/market/list/gainers', cache(10), proxy)
router.use('/stock/market/list/losers', cache(10), proxy)

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

// const proxyServer = httpProxy.createProxyServer({
//   changeOrigin: true,
//   ignorePath: true
// })

// const proxy = (req: any, res: any) => {
//   proxyServer.web(req, res, {
//     target: getURL(req.originalUrl).href
//   })
// }
