/* eslint-disable max-classes-per-file */
import { EventEmitter } from 'events'
import { Router, Response } from 'express'
import axios from 'axios'

import { api } from '../utils'
import { ResourceNotFound, IncorrectValues } from '../errors'

interface Channel {
  subscribe: (res: Response) => void
}

class SSE extends EventEmitter {
  public channels: Map<string, Channel> = new Map()

  createChannel = async (id: string, targetURL: string): Promise<Channel> => {
    let stream: any
    let partialMessage: string
    const cache = new Map()

    const connect = async () => {
      const response = await axios(targetURL, { responseType: 'stream' })
      stream = response.data
    }

    await connect()

    stream.on('end', async () => {
      await connect()
    })

    stream.on('complete', async () => {
      await connect()
    })

    stream.on('error', async () => {
      await connect()
    })

    stream.on('data', (response: Buffer) => {
      const chunk = response.toString()
      let cleanedChunk = chunk.replace(/data: /g, '')

      if (partialMessage) {
        cleanedChunk = partialMessage + cleanedChunk
        partialMessage = ''
      }

      const chunkArray = cleanedChunk.split('\r\n\r\n')

      chunkArray.forEach(message => {
        if (message) {
          try {
            const { symbol } = JSON.parse(message)[0]
            // this.emit(id, { event: symbol, data: message })
            this.emit(id, { data: message })

            cache.set(symbol, message)
          } catch (error) {
            partialMessage = message
          }
        }
      })
    })

    const channel: Channel = {
      subscribe: (res: Response) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        })

        // const listener = ({ event, data }: { event: string; data: string }) => {
        //   res.write(`event: ${event}\n`)
        //   res.write(`data: ${data}\n\n`)
        //   res.flush()
        // }
        const listener = ({ data }: { data: string }) => {
          res.write(`data: ${data}\n\n`)
          res.flush()
        }

        this.on(id, listener)

        if (this.listenerCount(id) > 1) {
          cache.forEach((data, symbol) => {
            this.emit(id, { event: symbol, data })
          })
        }

        res.on('close', () => {
          this.off(id, listener)

          if (this.listenerCount(id) === 0) {
            stream.destroy()
            this.channels.delete(id)
          }
        })
      },
    }

    this.channels.set(id, channel)

    return channel
  }
}

const router = Router()
const sse = new SSE()

router.get('/market-movers/:type(mostactive|gainers|losers)', async (req, res, next) => {
  try {
    let channel = sse.channels.get(req.originalUrl)

    if (!channel) {
      const response = await axios('http://localhost:3000/market-movers/gainers')

      const symbols = response.data.map((q: any) => q.symbol).join(',')
      const url = api.iex.urlSse(`/stocksUSNoUTP1Second?symbols=${symbols}`)
      channel = await sse.createChannel(req.originalUrl, url)
    }

    channel.subscribe(res)
  } catch (error) {
    next(new ResourceNotFound())
  }
})

// eslint-disable-next-line consistent-return
router.get('/stock/quote', async (req, res, next) => {
  if (!req.query.symbols && typeof req.query.symbols !== 'string') {
    return next(new IncorrectValues('No symbols provided.'))
  }

  try {
    const getOrCreateChannel = async (symbols: string) => {
      let channel = sse.channels.get(req.originalUrl)

      if (!channel) {
        const url = api.iex.urlSse(`/stocksUSNoUTP1Second?symbols=${symbols}`)
        channel = await sse.createChannel(req.originalUrl, url)
      }

      return channel
    }

    // const symbols = Array.isArray(req.query.symbols) ? req.query.symbols : [req.query.symbols]
    // const channels = await Promise.all(symbols.map(symbol => getOrCreateChannel(symbol as string)))
    const channel = await getOrCreateChannel(req.query.symbols as string)
    channel.subscribe(res)
  } catch (error) {
    next(new ResourceNotFound())
  }
})

const cryptoSymbols = 'BTCUSD,ETHUSD,LTCUSD,ADAUSDT,SOLUSDT,SHIBUSDT'

router.get('/cryptos', async (req, res, next) => {
  try {
    let channel = sse.channels.get(req.originalUrl)

    if (!channel) {
      const url = api.iex.urlSse(`/cryptoQuotes?symbols=${cryptoSymbols}`)
      channel = await sse.createChannel(req.originalUrl, url)
    }

    channel.subscribe(res)
  } catch (error) {
    next(new ResourceNotFound())
  }
})

const fxSymbols = 'EURUSD,GBPUSD,USDJPY,AUDUSD,USDCAD,USDCHF'

router.get('/fx', async (req, res, next) => {
  try {
    let channel = sse.channels.get(req.originalUrl)

    if (!channel) {
      const url = api.iex.urlSse(`/forex5Second?symbols=${fxSymbols}`)
      channel = await sse.createChannel(req.originalUrl, url)
    }

    channel.subscribe(res)
  } catch (error) {
    next(new ResourceNotFound())
  }
})

export default router
