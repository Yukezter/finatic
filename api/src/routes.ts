import Router from 'express-promise-router'

import * as market from './controllers/market'
import * as news from './controllers/news'
import { getCache, setCache } from './middleware'

const router = Router()

router.route('/search/:fragment').get(news.getSearchResults, setCache)
router.route('/market').get(getCache, market.getMarketData, setCache)
router.route('/news').get(getCache, news.getNewsData, setCache)
router.route('/company/:symbol').get(getCache, news.getCompanyData, setCache)

export default router
