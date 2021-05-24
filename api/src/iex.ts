import axios, { AxiosResponse } from 'axios'
import Bottleneck from 'bottleneck'

const IEX_BASE_URL = 'https://cloud.iexapis.com/stable'
const token: string = process.env.IEX_TOKEN || ''

// IEX Rate limit is 100 requests per second (1 per 10ms)
const limiter = new Bottleneck({
  reservoir: 100,
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 1000,
  minTime: 10,
  maxConcurrent: 1
})

const fetchIEXData = limiter.wrap(
  (url: string, queryParams: any): Promise<AxiosResponse> => {
    const params = new URLSearchParams(queryParams)
    params.append('token', token)
    return axios(IEX_BASE_URL.concat(url, '?', params.toString()))
  }
)

export const cryptoQuote = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/crypto/${symbol}/quote`, queryParams)
}

export const fxRate = (queryParams = {}): Promise<any> => {
  return fetchIEXData(`/fx/latest`, queryParams)
}

export const marketDataPoint = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/data-points/market/${symbol}`, queryParams)
}

export const marketList = (listType: string): Promise<any> => {
  return fetchIEXData(`/stock/market/list/${listType}`, { listLimit: 20 })
}

export const marketEarningsToday = (queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/market/today-earnings`, queryParams)
}

export const marketNews = (listType: string): Promise<any> => {
  return fetchIEXData(`/stock/market/list/${listType}`, { listLimit: 20 })
}

export const stockSearch = (fragment: string, queryParams = {}): Promise<any> => {
  return fetchIEXData('/search/'.concat(fragment), queryParams)
}

export const stockNews = (symbol: string, last: number | string = 10): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/news`, { last })
}

export const stockQuote = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/quote`, queryParams)
}

export const stockChart = (symbol: string, range = '1d', queryParams = {}): Promise<any> => {
  if (range === '1d') {
    return fetchIEXData(`/stock/${symbol}/intraday-prices`, {
      chartInterval: 5,
      ...queryParams
    })
  }

  return fetchIEXData(`/stock/${symbol}/chart/${range}`, {
    chartCloseOnly: true,
    includeToday: true,
    ...queryParams
  })
}

export const stockCompany = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/company`, queryParams)
}

export const stockStats = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/stats`, queryParams)
}

export const stockEstimates = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/estimates`, queryParams)
}

export const batch = (symbol: string, queryParams = {}): Promise<any> => {
  return fetchIEXData(`/stock/${symbol}/batch`, queryParams)
}
