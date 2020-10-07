import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient()
const toPromise = (func: Function) => promisify(func).bind(client)

client.on('connect', () => {
  console.log('REDIS!!!')
})

export const GET = toPromise(client.GET)
export const SET = toPromise(client.SET)