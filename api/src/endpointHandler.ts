import { setTimeout } from 'timers'
import { Server, Socket } from 'socket.io'
import NodeCache from 'node-cache'

import * as iex from './iex'

const ActiveEndpoints = new NodeCache()

export default (io: Server): any => {
  class ActiveEndpoint {
    timeoutID: ReturnType<typeof setTimeout>
    data: any = null

    constructor(
      public room: string,
      endpoint: keyof typeof iex,
      ...args: [a1: string, a2?: string]
    ) {
      this.room = room
      this.start(endpoint, ...args)
    }

    static isActive = (room: string): boolean => {
      const thisRoom = io.of('/').adapter.rooms.get(room)
      return thisRoom !== undefined && thisRoom.size > 0
    }

    getData = () => {
      return this.data
    }

    start = (endpoint: keyof typeof iex, ...args: [a1: string, a2?: string]) => {
      iex[endpoint](...args)
        .then(({ data }) => {
          if (ActiveEndpoint.isActive(this.room)) {
            console.log(`${this.room} has updated`)

            io.to(this.room).emit(`${this.room}`, data)
            this.data = data

            this.timeoutID = setTimeout(this.start, 5000, endpoint, ...args)
          }
        })
        .catch((error: Error) => {
          console.log(error)
        })
    }

    stop = () => {
      clearTimeout(this.timeoutID)
    }
  }

  const subscribe = function (this: Socket, _symbols: string | string[]) {
    const socket = this
    const symbols = Array.isArray(_symbols) ? _symbols : [_symbols]

    symbols.forEach((symbol: string) => {
      const activeEndpoint: ActiveEndpoint | undefined = ActiveEndpoints.get(symbol)

      if (activeEndpoint !== undefined) {
        io.to(socket.id).emit(symbol, activeEndpoint.getData())
      } else {
        ActiveEndpoints.set(symbol, new ActiveEndpoint(symbol, 'stockQuote', symbol))
      }
    })

    void socket.join(symbols)

    console.log('Joined rooms:', symbols)
  }

  const unsubscribe = function (this: Socket, _symbols: string | string[]) {
    const socket = this
    const symbols = Array.isArray(_symbols) ? _symbols : [_symbols]

    symbols.forEach(symbol => {
      void socket.leave(symbol)
    })

    console.log('Left rooms:', symbols)
  }

  const onDeleteRoom = (room: string) => {
    const activeEndpoint: ActiveEndpoint | undefined = ActiveEndpoints.get(room)

    if (activeEndpoint !== undefined) {
      activeEndpoint.stop()
      ActiveEndpoints.del(room)
    }

    console.log('Deleting room:', room)
    console.log(ActiveEndpoints.keys())
  }

  io.of('/').adapter.on('delete-room', onDeleteRoom)

  return {
    subscribe,
    unsubscribe,
    onDeleteRoom
  }
}
