import redis from 'redis'
import { Response, NextFunction, Handler } from 'express'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-shadow
  interface Response {
    cache: {
      data: any
      writeHead: any
      write: any
      end: any
    }
  }
}

interface Cached {
  status: number
  headers: any
  data: any
  encoding: BufferEncoding
}

const redisClient = redis.createClient()

const shouldCacheResponse = (res: Response): boolean => {
  return res.statusCode === 200
}

const accumulateData = (res: Response, chunk: unknown): void => {
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

const cacheResponse = (key: string, data: unknown, ttl: number): void => {
  try {
    redisClient.set(key, JSON.stringify(data))
    redisClient.expire(key, ttl)
  } catch (error) {
    console.log('redis error')
  }
}

const patchResponse = (res: Response, next: NextFunction, key: string, ttl: number): void => {
  res.cache = {
    data: undefined,
    writeHead: res.writeHead,
    write: res.write,
    end: res.end,
  }

  res.writeHead = function writeHead(...args: any[]): Response<any> {
    res.setHeader(
      'Cache-Control',
      shouldCacheResponse(res) ? `max-age=${ttl.toFixed(0)}` : 'no-cache, no-store, must revalidate'
    )

    return res.cache.writeHead.apply(this, args)
  }

  res.write = function write(...args: any[]): boolean {
    const chunk = args[0]

    accumulateData(res, chunk)
    return res.cache.write.apply(this, args)
  }

  res.end = function end(...args: any[]): void {
    const [chunk, encoding] = args

    if (shouldCacheResponse(res)) {
      accumulateData(res, chunk)
      cacheResponse(
        key,
        {
          status: res.status,
          headers: res.getHeaders(),
          data: res.cache.data,
          encoding,
        },
        ttl
      )
    }

    return res.cache.end.apply(this, args)
  }

  next()
}

const sendCachedResponse = (res: Response, cached: Cached, ttl: number): void => {
  const headers = { ...cached.headers }
  headers['Cache-Control'] = `max-age=${ttl}`

  let { data } = cached
  if (data && data.type === 'Buffer') {
    data = typeof data.data === 'number' ? Buffer.alloc(data.data) : Buffer.from(data.data)
  }

  res.writeHead(200, headers)
  return res.end(data, data.encoding)
}

const middleware = (duration = 5 * 60): Handler => {
  const ttl = Math.min(duration, 2147483647)

  return (req, res, next) => {
    const key = req.originalUrl

    try {
      redisClient
        .multi()
        .get(key)
        .ttl(key)
        .exec((error, reply) => {
          if (error || !reply[0] || !reply[1]) {
            patchResponse(res, next, key, ttl)
          } else {
            sendCachedResponse(res, JSON.parse(reply[0]), reply[1])
          }
        })
    } catch (error) {
      console.log('redis error')
      next(error)
    }
  }
}

export default middleware
