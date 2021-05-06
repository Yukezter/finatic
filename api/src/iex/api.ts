import axios, { AxiosResponse } from 'axios'

const baseURL = 'https://cloud.iexapis.com/stable'
const token: string = process.env.IEX_TOKEN || ''

const fetch = async (url: string, queryParams = {}): Promise<AxiosResponse> => {
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

export const forex = (currencyPairs: string): Promise<any> => {
  return fetch(`/fx/latest`, { symbols: currencyPairs })
}

export const earningsToday = (): Promise<any> => {
  return fetch(`/stock/market/today-earnings`)
}

export const news = (
  last: number | string = 20,
  symbol: null | string = null
): Promise<any> => {
  if (symbol) {
    return fetch(`/stock/${symbol}/news`, { last })
  }

  return fetch(`/time-series/news`, {
    subattribute: 'lang|en',
    last
  })
}

export const price = (symbol: string): Promise<any> => {
  return fetch(`/stock/${symbol}/price`)
}

export const quote = (symbol: string): Promise<any> => {
  return fetch(`/stock/${symbol}/quote`)
}

export const batch = (symbol: string): Promise<any> => {
  return fetch(`/stock/${symbol}/batch`, {
    // types: 'quote,company,advanced-stats,recommendation-trends,earnings',
    types: 'quote,advanced-stats,company',
    last: 4
  })
}

export const chart = (symbol: string, range: string): Promise<any> => {
  if (range === '1d') {
    return fetch(`/stock/${symbol}/intraday-prices`, {
      chartInterval: 5
    })
  }

  return fetch(`/stock/${symbol}/chart/${range}`, {
    chartCloseOnly: true,
    includeToday: true
  })
}

export const company = (symbol: string): Promise<any> => {
  return fetch(`/stock/${symbol}/company`)
}

export const estimates = (symbol: string): Promise<any> => {
  return fetch(`/stock/${symbol}/estimates`)
}
