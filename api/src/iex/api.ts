import axios from 'axios'

const baseURL = 'https://cloud.iexapis.com/stable'
const token: string = process.env.IEX_TOKEN || ''

const fetch = async (url: string): Promise<any> => {
  const response = await axios.get(baseURL.concat(url, '?token=', token))
  return response.data
}

export const search = (fragment: string): Promise<any> => {
  return fetch('/search/'.concat(fragment))
}

export const list = (listType: string): Promise<any> => {
  return fetch(`/stock/market/list/${listType}`)
}

export const sectorPerformance = (): Promise<any> => {
  return fetch('/stock/market/sector-performance')
}

export const dataPoints = (): Promise<any> => {
  return fetch(`/data-points/market`)
}

export const dataPoint = (key: string): Promise<any> => {
  return fetch(`/data-points/market/${key}`)
}
