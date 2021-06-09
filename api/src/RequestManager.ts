import { EventEmitter } from 'events'
import { setTimeout } from 'timers'
import { Request, Response } from 'express'
import redis from 'redis'
import axios, { AxiosError } from 'axios'

import { routeCache } from './middlewares'

interface Client {
  req: Request
  res: Response
}

const redisClient = redis.createClient()
const baseURL = 'http://localhost:3000'

export default class RequestManager extends EventEmitter {
  channels: Map<string, () => void>
  latestData: any

  constructor() {
    super()
    this.channels = new Map()
  }

  publish = (event: string, data: string): void => {
    this.emit(event, data)
  }

  subscribe = (event: string, client: Client): void => {
    const listener = (data: string) => {
      client.res.write(`data: ${data}\n\n`)
      client.res.flush()
    }

    if (!this.hasListeners(event)) this.open(event)
    this.on(event, listener)

    client.res.on('close', () => {
      this.off(event, listener)
      if (!this.hasListeners(event)) this.close(event)
      client.res.end()
    })
  }

  open = (path: string, interval = 5000): void => {
    const { pathname, href } = new URL(path, baseURL)

    console.log(pathname)

    const makeRequest = () => {
      try {
        redisClient
          .multi()
          .get(pathname)
          .ttl(pathname)
          .exec((redisError, reply) => {
            if (redisError || !reply[0] || !reply[1]) {
              console.log('wow not cached!')
              axios(href, { responseType: 'arraybuffer' })
                .then(({ status, headers, data }) => {
                  if (this.hasListeners(pathname)) {
                    routeCache.cacheResponse(pathname, { status, headers, data }, 10)

                    this.publish(pathname, data.toString())
                    setTimeout(makeRequest, interval)
                  } else {
                    this.close(pathname)
                  }
                })
                .catch((axiosError: AxiosError) => {
                  console.log(axiosError)
                  this.close(pathname)
                })
            } else {
              console.log('cached!')
              this.publish(pathname, Buffer.from(JSON.parse(reply[0]).data.data).toString())
            }
          })
      } catch (error) {
        console.log('redis error')
      }

      // axios(href, { responseType: 'arraybuffer' })
      //   .then(({ data }) => {
      //     if (this.hasListeners(pathname)) {
      //       this.publish(pathname, data.toString())
      //       setTimeout(makeRequest, interval)
      //     } else {
      //       this.close(pathname)
      //     }
      //   })
      //   .catch((error: AxiosError) => {
      //     console.log(error)
      //     this.close(pathname)
      //   })

      return makeRequest
    }

    this.channels.set(pathname, makeRequest())
  }

  close = (event: string): void => {
    this.removeAllListeners(event)
    this.channels.delete(event)
  }

  hasListeners = (event: string): boolean => {
    return this.listenerCount(event) > 0
  }
}
