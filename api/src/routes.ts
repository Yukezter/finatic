import Router from 'express-promise-router'

import * as market from './controllers/market'
import * as news from './controllers/news'
import * as search from './controllers/search'
import * as stock from './controllers/stock'
import { getCache, setCache } from './middleware'

const router = Router()

// Pages
// router.route('/market').get(getCache, market.getMarketData, setCache)
router.route('/news').get(getCache, news.getNews, setCache)
router.route('/stock/:symbol').get(getCache, stock.getStockData, setCache)

router.route('/search/:fragment').get(search.getSearchResults)
router
  .route('/market/list/:type(mostactive|gainers|losers)')
  .get(getCache, market.getList, setCache)
router.route('/stock/:symbol/news').get(getCache, news.getCompanyNews, setCache)
router
  .route('/stock/:symbol/chart/:range(1d|5dm|1m|3m|1y)')
  .get(getCache, stock.getChartData, setCache)

export default router
