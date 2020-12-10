/* eslint-disable @typescript-eslint/unbound-method */
import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient()
const toPromise = (func: any) => promisify(func).bind(client)

client.on('connect', () => {
  console.log('REDIS!!!')
})

export const GET = toPromise(client.GET)
export const SET = toPromise(client.SET)
