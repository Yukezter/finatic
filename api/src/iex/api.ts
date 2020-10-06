import axios, { AxiosPromise } from 'axios'

const baseURL = 'https://cloud.iexapis.com/stable'
const token: string = process.env.IEX_TOKEN || ''

const fetch = (url: string): AxiosPromise => {
  return axios.get(baseURL.concat(url, '?token=', token))
}

export const search = (fragment: string): AxiosPromise => {
  return fetch('/search/'.concat(fragment))
}

export const list = (listType: string): AxiosPromise => {
  return fetch(`/stock/market/list/${listType}`)
}

export const sectorPerformance = (): AxiosPromise => {
  return fetch('/stock/market/sector-performance')
}

export const dataPoints = (): AxiosPromise => {
  return fetch(`/data-points/market`)
}

export const dataPoint = (key: string): AxiosPromise => {
  return fetch(`/data-points/market/${key}`)
}
