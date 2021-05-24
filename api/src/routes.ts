import { Request, Response } from 'express'
import Router from 'express-promise-router'
import apicache from 'apicache'
import redis from 'redis'

import { proxy } from './server'

const router = Router()
const redisClient = redis.createClient()

const routeCache = apicache.options({
  // enabled: false,
  redisClient,
  headers: { 'Cache-Control': 'no-cache' },
  statusCodes: { exclude: [404, 403] }
}).middleware

const routeHandler = (req: Request, res: Response) => {
  redisClient.KEYS(req.originalUrl, (_err, value) => {
    console.log(value)
  })

  proxy.web(req, res, {
    target: 'https://cloud.iexapis.com/stable'
  })
}

const commodities = ['DCOILWTICO', 'GASREGCOVW', 'DJFUELUSGULF'].join('|')
const economicData = [
  'DGS1',
  'DGS5',
  'DGS10',
  'CPIAUCSL',
  'TERMCBCCALLNS',
  'A191RL1Q225SBEA',
  'RECPROUSM156N'
].join('|')

// Search
router.route('/stock/search/:fragment').get(routeHandler)

// Market Page
router.route('/fx/latest').get(routeCache('10 seconds'), routeHandler)

router
  .route('/crypto/:symbol(btcusd|ethusd|ltcusd)/quote')
  .get(routeCache('10 seconds'), routeHandler)
router
  .route(`/data-points/market/:symbol(${commodities})`)
  .get(routeCache('1 week'), routeHandler)
router
  .route(`/data-points/market/:symbol(${economicData})`)
  .get(routeCache('1 day'), routeHandler)
router
  .route('/stock/market/list/:type(mostactive|gainers|losers)')
  .get(routeCache('10 seconds'), routeHandler)

// News Page
router.route('/news').get(routeCache('10 seconds'), routeHandler)

// Stock Page
router.route('/stock/:symbol/quote').get(routeCache('10 seconds'), routeHandler)
router.route('/stock/:symbol/intraday-prices').get(routeCache('5 minutes'), routeHandler)
router.route('/stock/:symbol/chart/:range').get(routeCache('5 minutes'), routeHandler)
router.route('/stock/:symbol/company').get(routeCache('1 day'), routeHandler)
router.route('/stock/:symbol/stats').get(routeCache('1 day'), routeHandler)
// router.get('/stock/:symbol/estimates', cacheWithRedis(''), routeHandler)

export default router
