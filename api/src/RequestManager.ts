import { EventEmitter } from 'events'
import { setTimeout } from 'timers'
import { Request, Response } from 'express'
import axios from 'axios'

interface Client {
  req: Request
  res: Response
}

const getURL = (path: string) => {
  return new URL(path, 'http://localhost:3000')
}

export default class RequestManager extends EventEmitter {
  timers: Map<string, ReturnType<typeof setTimeout>> = new Map()

  publish = (event: string, data: string): void => {
    this.emit(event, data)
  }

  subscribe = (event: string, client: Client): void => {
    const listener = (data: string) => {
      client.res.write(`data: ${data}\n\n`)
      client.res.flush()
    }

    if (this.hasNoListeners(event)) this.open(event)
    this.on(event, listener)

    client.res.on('close', () => {
      this.off(event, listener)
      if (this.hasNoListeners(event)) this.close(event)
      client.res.end()
    })
  }

  open = (path: string, interval = 5000): void => {
    const { href } = getURL(path)

    const fetch = () => {
      axios(href, { responseType: 'arraybuffer' })
        .then(({ data }) => {
          if (!this.hasNoListeners(path)) {
            this.publish(path, data.toString())
            this.timers.set(path, setTimeout(fetch, interval))
          }
        })
        .catch(error => {
          console.log(error)
          this.close(path)
        })
    }

    fetch()
  }

  close = (event: string): void => {
    this.removeAllListeners(event)
    const timer = this.timers.get(event)
    if (timer) {
      clearInterval(timer)
      this.timers.delete(event)
    }

    console.debug('closed')
  }

  hasNoListeners = (event: string): boolean => {
    return this.listenerCount(event) === 0
  }
}

// const fetch = () => {
//   try {
//     redisClient
//       .multi()
//       .get(path)
//       .ttl(path)
//       .exec((redisError, reply) => {
//         if (redisError || !reply[0] || !reply[1]) {
//           axios(href, { responseType: 'arraybuffer' })
//             .then(({ status, headers, data }) => {
//               routeCache.cacheRes(path, { status, headers, data }, 60)

//               if (!this.hasNoListeners(path)) {
//                 this.publish(path, data.toString())
//                 this.services.set(path, setTimeout(fetch, interval))
//               }
//             })
//             .catch(axiosError => {
//               console.log(axiosError)
//               this.close(path)
//             })
//         } else if (!this.hasNoListeners(path)) {
//           const buffer = Buffer.from(JSON.parse(reply[0]).data.data)
//           this.publish(path, buffer.toString())
//           this.services.set(path, setTimeout(fetch, interval))
//         }
//       })
//   } catch (error) {
//     console.log('redis error')
//   }
// }
