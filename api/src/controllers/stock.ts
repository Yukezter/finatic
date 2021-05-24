import { EventEmitter } from 'events'
import { Request, Response } from 'express'
import { setTimeout } from 'timers'
import NodeCache from 'node-cache'

// import { CustomError } from '../errors'
import * as iex from '../iex'

const streams = new Map()
const eventEmitter = new EventEmitter()

class Stream {
  timeoutID: ReturnType<typeof setTimeout>
  data = ''

  constructor(
    public key: string,
    endpoint: keyof typeof iex,
    ...args: [a1: string, a2?: string]
  ) {
    this.key = key
    this.start(endpoint, ...args)
  }

  start = (endpoint: keyof typeof iex, ...args: [a1: string, a2?: string]) => {
    iex[endpoint](...args)
      .then(({ data }) => {
        if (streams.has(this.key)) {
          const stringified = JSON.stringify(data)
          eventEmitter.emit(`${this.key}`, stringified)
          this.data = stringified

          this.timeoutID = setTimeout(this.start, 5000, endpoint, ...args)
        }
      })
      .catch((error: Error) => {
        console.log(error)
      })
  }

  end = () => {
    clearTimeout(this.timeoutID)
    streams.delete(this.key)
  }

  getData = () => {
    return this.data
  }
}

const stockCache = new NodeCache()

const securityTypes = 'ad,cs,etf,cef,oef,wt'

export const getStockSearch = async (req: Request, res: Response): Promise<void> => {
  const { fragment } = req.params

  const data = await iex.stockSearch(fragment)

  const filteredData = []
  let index = 0

  while (index < data.length - 1 && filteredData.length < 6) {
    const result = data[index]
    if (securityTypes.indexOf(result.securityType) !== -1) {
      filteredData.push(result)
    }
    ++index
  }

  res.json(filteredData)
}

export const getStockQuote = async (req: Request, res: Response): Promise<any> => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  res.write(`data: ${req.hostname}\n\n`)
  res.flush()

  const symbols = req.query.symbols?.toString().trim()
  const listener = (data: string) => {
    res.write(`data: ${data}\n\n`)
    res.flush()
  }

  if (symbols && symbols.length < 200) {
    symbols.split(',').forEach(symbol => {
      const key = `${symbol}-quote`
      const stream: Stream | undefined = streams.get(key)

      if (stream === undefined) {
        streams.set(key, new Stream(key, 'stockQuote', symbol))
      } else {
        res.write(`data: ${stream.data}\n\n`)
        res.flush()
      }

      eventEmitter.on(key, listener)
    })

    req.on('close', () => {
      symbols.split(',').forEach(symbol => {
        const key = `${symbol}-quote`
        const stream: Stream | undefined = streams.get(key)

        if (stream !== undefined) {
          eventEmitter.off(key, listener)
          stream.end()
        }
      })

      res.end()
    })
  }
}

export const getStockChart = async (req: Request, res: Response): Promise<any> => {
  const { symbol, range } = req.params

  let chartData = stockCache.get(`${symbol}-chart-${range}`)

  if (chartData === undefined) {
    const response = await iex.stockChart(symbol, range)

    const data = response.data.map((bucket: any) => ({
      x: new Date(`${bucket.date as string} ${(bucket.minute as number) || ''}`),
      y: bucket.close || null
    }))

    stockCache.set(`${symbol}-chart-${range}`, data, 30)
    chartData = data
  }

  res.json(chartData)
}

export const getStockBatch = async (req: Request, res: Response): Promise<any> => {
  const { symbol } = req.params

  let company = stockCache.get(`${symbol}-company`)

  if (company === undefined) {
    const response = await iex.stockCompany(symbol)
    stockCache.set(`${symbol}-company`, response.data, 24 * 60 * 60)
    company = response.data
  }

  let stats = stockCache.get(`${symbol}-stats`)

  if (stats === undefined) {
    const response = await iex.stockStats(symbol)
    stockCache.set(`${symbol}-stats`, response.data, 10 * 60)
    stats = response.data
  }

  let news = stockCache.get(`${symbol}-news`)

  if (news === undefined) {
    const response = await iex.stockNews(symbol)
    stockCache.set(`${symbol}-news`, response.data, 6 * 60 * 60)
    news = response.data
  }

  res.json({
    company,
    stats,
    news
  })
}
