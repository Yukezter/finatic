import { EventEmitter } from 'events'
import { setTimeout } from 'timers'
import { Request, Response } from 'express'
import axios from 'axios'

interface Client {
  req: Request
  res: Response
}

export default class RequestManager extends EventEmitter {
  timers: Map<string, ReturnType<typeof setTimeout>> = new Map()

  hasNoListeners = (event: string): boolean => {
    return this.listenerCount(event) === 0
  }

  open = (path: string, interval = 5000): void => {
    const { href } = new URL(path, 'http://localhost:3000')

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
}
