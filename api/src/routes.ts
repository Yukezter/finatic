import Router from 'express-promise-router'

import * as market from './controllers/market'
import * as news from './controllers/news'

const router = Router()

router.route('/search/:fragment').get(news.getSearchResults)
router.route('/market').get(market.getMarketData)
router.route('/news').get(news.getNewsData)
router.route('/company/:symbol').get(news.getCompanyData)

export default router
