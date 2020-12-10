import axios from 'axios'

const baseURL = 'https://cloud.iexapis.com/stable'
const token: string = process.env.IEX_TOKEN || ''

const fetch = async (url: string, queryParams = {}): Promise<any> => {
  const params = new URLSearchParams(queryParams)
  params.append('token', token)
  const response = await axios.get(baseURL.concat(url, '?', params.toString()))
  return response.data
}

export const search = (fragment: string): Promise<any> => {
  return fetch('/search/'.concat(fragment))
}

export const list = (listType: string): Promise<any> => {
  return fetch(`/stock/market/list/${listType}`, { listLimit: 20 })
}

export const earningsToday = (): Promise<any> => {
  return fetch(`/stock/market/today-earnings`)
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
