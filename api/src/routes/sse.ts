import { EventEmitter } from 'events'
import { Request, Response } from 'express'
import Router from 'express-promise-router'
import axios from 'axios'

import { IncorrectValues } from '../Errors'

interface Client {
  req: Request
  res: Response
  channels: Set<string>
  listener: (data: string) => void
}

class SSE extends EventEmitter {
  public channels: Map<
    string,
    {
      clients: Set<Client>
      clear: () => void
    }
  > = new Map()

  start = (channelName: string, interval: number): (() => void) => {
    const { href } = new URL(channelName, 'http://localhost:3000')
    let timeoutID: ReturnType<typeof setTimeout>

    const fetch = () => {
      axios(href, { responseType: 'arraybuffer' })
        .then(({ data }) => {
          if (this.channels.has(channelName)) {
            this.publish(channelName, data.toString())
            timeoutID = setTimeout(fetch, interval)
          }
        })
        .catch(error => {
          const channel = this.channels.get(channelName)
          if (channel) {
            channel.clients.forEach(client => {
              client.channels.delete(channelName)
              if (client.channels.size === 0) {
                client.res.end()
              }
            })
          }

          this.channels.delete(channelName)
          this.removeAllListeners(channelName)

          console.log(error.message)
          this.log()
        })
    }

    fetch()

    return () => {
      clearTimeout(timeoutID)
    }
  }

  subscribe = (req: Request, res: Response, event: string | string[]): void => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    const listener = (data: string) => {
      res.write(`data: ${data}\n\n`)
      res.flush()
    }

    const channels = new Set(Array.isArray(event) ? event : [event])
    const client = { req, res, channels, listener }

    channels.forEach(channelName => {
      const channel = this.channels.get(channelName)

      if (!channel) {
        this.channels.set(channelName, {
          clients: new Set([client]),
          clear: this.start(channelName, 10 * 1000)
        })
      } else {
        channel.clients.add(client)
      }

      this.on(channelName, listener)
    })

    res.on('close', () => {
      channels.forEach(channelName => {
        const channel = this.channels.get(channelName)

        if (channel) {
          channel.clients.delete(client)
          if (channel.clients.size === 0) {
            channel.clear()
            this.channels.delete(channelName)
          }
        }

        this.off(channelName, listener)
      })

      this.log()
    })
  }

  publish = (event: string, data: string): void => {
    this.emit(event, data)
  }

  log = (): void => {
    console.log('Channels: ', this.eventNames())
  }
}

const router = Router()
const sse = new SSE()

const validateSymbols = (symbols: any, limit: number): string[] => {
  if (typeof symbols !== 'string') throw new IncorrectValues()
  return symbols.split(',', limit).filter(s => s.trim())
}

router.route('/stock/quote').get((req: Request, res: Response) => {
  const events = validateSymbols(req.query.symbols, 50).map(symbol => {
    return `/stock/${symbol}/quote`
  })

  sse.subscribe(req, res, events)
})

router.route('/crypto/quote').get((req: Request, res: Response) => {
  const events = validateSymbols(req.query.symbols, 3).map(symbol => {
    return `/crypto/${symbol}/quote`
  })

  sse.subscribe(req, res, events)
})

router.route('/stock/chart/:range').get((req: Request, res: Response) => {
  const { range } = req.params

  const queryParams = new URLSearchParams({
    includeToday: 'true',
    displayPercent: 'true'
  }).toString()

  const events = validateSymbols(req.query.symbols, 4).map(symbol => {
    return `/stock/${symbol}/chart/${range}${queryParams}`
  })

  sse.subscribe(req, res, events)
})

export default router
