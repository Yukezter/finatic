import { Request, Response } from 'express'
import Router from 'express-promise-router'

import RequestManager from '../RequestManager'
import { InvalidParams } from '../errors/Errors'

const router = Router()
const requestManager = new RequestManager()

const writeHead = (res: Response): void => {
  res
    .writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    .flushHeaders()
}

const validateAndGetSymbols = (symbols: any, limit: number): string[] => {
  if (typeof symbols !== 'string') throw new InvalidParams('Incorrect Values')
  return symbols.split(',', limit).filter(s => s.trim())
}

router.route('/stock/quote').get((req: Request, res: Response) => {
  writeHead(res)

  validateAndGetSymbols(req.query.symbols, 20).forEach(symbol => {
    const key = `/stock/${symbol}/quote`
    requestManager.subscribe(key, { req, res })
  })
})

router.route('/crypto/quote').get((req: Request, res: Response) => {
  writeHead(res)

  validateAndGetSymbols(req.query.symbols, 3).forEach(symbol => {
    const key = `/crypto/${symbol}/quote`
    requestManager.subscribe(key, { req, res })
  })
})

router.route('/stock/chart/:range').get((req: Request, res: Response) => {
  writeHead(res)

  const { range } = req.params

  validateAndGetSymbols(req.query.symbols, 3).forEach(symbol => {
    const qps = new URLSearchParams({
      includeToday: 'true',
      displayPercent: 'true'
    })

    const key = `/stock/${symbol}/chart/${range}${qps.toString()}`
    requestManager.subscribe(key, { req, res })
  })
})

export default router
