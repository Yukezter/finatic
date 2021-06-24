// eslint-disable-next-line max-classes-per-file
import { EventEmitter } from 'events'
import { Router, Request, Response } from 'express'
import axios from 'axios'

/*
The SSE class allows clients to subscribe to a unique 'channel'. Each channel is simply a
recursive function that REST calls the proxy app in 10 second intervals and pushes the
response data to any subscribed clients. Its identifier (or key) is the path that's used to
construct the url for the requests.

For example,

const client = sse.createClient(req, res)
client.subscribe('/stock/aapl/quote', 'aapl')
client.subscribe('/stock/aapl/quote', 'tsla')

will make recurring requests to

'localhost:3000/stock/aapl/quote' and 'localhost:3000/stock/tsla/quote'.

Each channel will push its response data to the client under the EventSource event names
'aapl' and 'tsla' every 10 seconds, respectively.
*/

interface Client {
  req: Request
  res: Response
  channels: Set<string>
  subscribe: (endpoint: string, event: string, interval?: number) => void
}

class SSE extends EventEmitter {
  public channels: Map<
    string,
    {
      latestData?: any
      clients: Set<Client>
      end: () => void
    }
  > = new Map()

  start = (endpoint: string, event: string): (() => void) => {
    const { href } = new URL(`/api${endpoint}`, 'http://localhost:8001')
    let timeoutID: ReturnType<typeof setTimeout>

    const fetch = () => {
      axios(href, { responseType: 'arraybuffer' })
        .then(({ data }) => {
          const channel = this.channels.get(endpoint)

          if (channel) {
            const latestData = { event, data: data.toString() }
            this.publish(endpoint, latestData)

            // Cache latest data
            channel.latestData = latestData
            timeoutID = setTimeout(fetch, 10 * 1000)
          }
        })
        .catch(() => {
          const channel = this.channels.get(endpoint)

          if (channel) {
            // Remove channel from each client's subscriptions
            channel.clients.forEach(client => {
              client.channels.delete(endpoint)
              // Delete client if there are no subscriptions left
              if (client.channels.size === 0) {
                client.res.end()
              }
            })
          }

          // Delete channel
          this.channels.delete(endpoint)
          this.removeAllListeners(endpoint)
        })
    }

    fetch()

    return () => {
      clearTimeout(timeoutID)
    }
  }

  createClient = (req: Request, res: Response): Client => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    const listener = ({ event, data }: { event: string; data: string }) => {
      res.write(`event: ${event}\n`)
      res.write(`data: ${data}\n\n`)
      res.flush()
    }

    const client: Client = {
      req,
      res,
      channels: new Set(),
      subscribe: (endpoint: string, event: string) => {
        const channel = this.channels.get(endpoint)

        if (!channel) {
          // Create channel and add subscriber
          this.channels.set(endpoint, {
            clients: new Set([client]),
            end: this.start(endpoint, event)
          })

          // Add channel to client's subscriptions
          client.channels.add(endpoint)

          this.on(endpoint, listener)
        } else if (!channel.clients.has(client)) {
          // Client can only subscribe once for each channel

          // Add client to channel's subscribers
          channel.clients.add(client)

          // Add channel to client's subscriptions
          client.channels.add(endpoint)
          this.on(endpoint, listener)

          // Send latest data
          this.publish(endpoint, channel.latestData)
        }
      }
    }

    res.on('close', () => {
      client.channels.forEach(endpoint => {
        const channel = this.channels.get(endpoint)

        if (channel) {
          // Remove client from channel's subscribers
          channel.clients.delete(client)
          // End and delete channel if there are no subscribers left
          if (channel.clients.size === 0) {
            channel.end()
            this.channels.delete(endpoint)
          }
        }

        // Remove listener
        this.off(endpoint, listener)
      })

      this.log()
    })

    return client
  }

  publish = (endpoint: string, data: any): void => {
    this.emit(endpoint, data)
  }

  log = (): void => {
    console.log('Channels: ', this.eventNames())
  }
}

const router = Router()
const sse = new SSE()

const getSymbols = (symbols: string, limit: number): Set<string> => {
  return new Set(symbols.split(',', limit).filter(s => s.trim()))
}

router.get('/stock/quote', (req, res) => {
  const symbols = getSymbols(req.query.symbols as string, 50)

  const client = sse.createClient(req, res)

  symbols.forEach(symbol => {
    client.subscribe(`/stock/${symbol}/quote`, symbol)
  })
})

router.get('/crypto/quote', (req, res) => {
  const symbols = getSymbols(req.query.symbols as string, 3)

  const client = sse.createClient(req, res)

  symbols.forEach(symbol => {
    client.subscribe(`/crypto/${symbol}/quote`, symbol)
  })
})

router.get('/stock/chart/:range(1d|5dm|1m|3m|1y)', (req, res) => {
  const { range } = req.params
  const symbols = getSymbols(req.query.symbols as string, 4)
  const client = sse.createClient(req, res)

  let queryParams: string

  if (range === '1d') {
    queryParams = '?chartIEXOnly=true&filter=minute,average'
    if (req.query.sparkline === 'true') {
      queryParams += '&chartInterval=10'
    } else {
      queryParams += '&chartInterval=5'
    }

    symbols.forEach(symbol => {
      const endpoint = `/stock/${symbol}/intraday-prices${queryParams}`
      client.subscribe(endpoint, symbol)
    })
  } else {
    queryParams = '?includeToday=true'
    if (range === '5dm') {
      queryParams += '&chartIEXOnly=true&filter=date,minute,average'
    } else {
      queryParams += '&chartCloseOnly=true&filter=date,close'
    }

    symbols.forEach(symbol => {
      const endpoint = `/stock/${symbol}/chart/${range}${queryParams}`
      client.subscribe(endpoint, symbol)
    })
  }
})

export default router
