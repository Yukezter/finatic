import { Request, Response } from 'express'
import Bottleneck from 'bottleneck'
import axios from 'axios'

import { ResourceNotFound } from './errors'

const IEX_BASE_URL = 'https://cloud.iexapis.com'
const IEX_TOKEN: string = process.env.IEX_TOKEN || ''

const apiLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 3000
})

const getURL = (path: string): string => {
  const url = new URL(`/stable${path}`, IEX_BASE_URL)
  url.searchParams.append('token', IEX_TOKEN)
  return url.href
}

const fetch = apiLimiter.wrap((url: string) => {
  return axios(url, { responseType: 'stream' })
})

export const proxy = async (req: Request, res: Response): Promise<void> => {
  const response = await fetch(getURL(req.originalUrl)).catch(error => {
    console.log(error)
  })

  if (!response || !response.data) {
    throw new ResourceNotFound()
  }

  response.data.pipe(res)
}
