/* eslint-disable @typescript-eslint/unbound-method */
import { Request, Response, NextFunction, Handler } from 'express'
import redis from 'redis'

interface Options {
  duration?: number
  includeParams?: boolean
}

interface Cached {
  status: number
  headers: any
  data: any
  encoding: BufferEncoding
}

const redisClient = redis.createClient()

class RouteCache {
  private globalOptions: Options = {}

  constructor() {
    this.globalOptions = {
      duration: 5 * 60,
      includeParams: false
    }
  }

  options = (options: Options): RouteCache => {
    this.globalOptions = { ...this.globalOptions, ...options }
    return this
  }

  shouldCache = (res: Response): boolean => {
    return res.statusCode === 200
  }

  accumulateData = (res: Response, chunk: unknown): void => {
    if (typeof chunk === 'string') {
      res.cache.data += chunk
    } else if (Buffer.isBuffer(chunk)) {
      if (typeof res.cache.data === 'string') {
        res.cache.data = Buffer.from(res.cache.data)
      } else if (typeof res.cache.data === 'undefined') {
        res.cache.data = Buffer.alloc(0)
      }

      res.cache.data = Buffer.concat([res.cache.data, chunk])
    }
  }

  cacheResponse = (key: string, data: unknown, ttl: number): void => {
    try {
      redisClient.set(key, JSON.stringify(data))
      redisClient.expire(key, ttl)
    } catch (error) {
      console.log('redis error')
    }
  }

  patchResponse = (res: Response, next: NextFunction, key: string, ttl: number): void => {
    const instance = this

    res.cache = {
      data: undefined,
      writeHead: res.writeHead,
      write: res.write,
      end: res.end
    }

    res.writeHead = function (...rest: any[]): Response<any> {
      res.setHeader(
        'Cache-Control',
        instance.shouldCache(res)
          ? `max-age=${ttl.toFixed(0)}`
          : 'no-cache, no-store, must revalidate'
      )

      return res.cache.writeHead.apply(this, rest)
    }

    res.write = function (...rest: any[]): boolean {
      const chunk = rest[0]

      instance.accumulateData(res, chunk)
      return res.cache.write.apply(this, rest)
    }

    res.end = function (...rest: any[]): void {
      const [chunk, encoding] = rest

      if (instance.shouldCache(res)) {
        instance.accumulateData(res, chunk)
        instance.cacheResponse(
          key,
          {
            status: res.status,
            headers: res.getHeaders(),
            data: res.cache.data,
            encoding
          },
          ttl
        )
      }

      return res.cache.end.apply(this, rest)
    }

    next()
  }

  sendCachedResponse = (res: Response, cached: Cached, ttl: number): void => {
    const headers = { ...cached.headers }
    headers['Cache-Control'] = `max-age=${ttl}`

    let { data } = cached
    if (data && data.type === 'Buffer') {
      data = typeof data.data === 'number' ? Buffer.alloc(data.data) : Buffer.from(data.data)
    }

    res.writeHead(200, headers)
    return res.end(data, data.encoding)
  }

  middleware = (duration?: number, localOptions: Options = {}): Handler => {
    const options = { ...this.globalOptions, ...localOptions }
    const ttl = Math.min(duration || this.globalOptions.duration || 5 * 60, 2147483647)

    return (req: Request, res: Response, next: NextFunction) => {
      const key = !options.includeParams ? req.baseUrl + req.path : req.originalUrl

      try {
        redisClient
          .multi()
          .get(key)
          .ttl(key)
          .exec((error, reply) => {
            if (error || !reply[0] || !reply[1]) {
              return this.patchResponse(res, next, key, ttl)
            }

            this.sendCachedResponse(res, JSON.parse(reply[0]), reply[1])
          })
      } catch (error) {
        console.log('redis error')
        next(error)
      }
    }
  }
}

export const routeCache = new RouteCache()
