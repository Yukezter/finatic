const IEX_BASE_URL = 'https://cloud.iexapis.com'
const IEX_SANDBOX_URL = 'https://sandbox.iexapis.com'
const { IEX_TOKEN = '', IEX_SANDBOX_TOKEN = '' } = process.env

const FINNHUB_BASE_URL = 'https://finnhub.io'
const { FINNHUB_TOKEN = '' } = process.env

export const getIEXUrl = (path: string): string => {
  const url = new URL(`/stable${path}`, IEX_SANDBOX_TOKEN ? IEX_SANDBOX_URL : IEX_BASE_URL)
  url.searchParams.append('token', IEX_SANDBOX_TOKEN || IEX_TOKEN)
  return url.href
}

export const getFinnhubUrl = (path: string): string => {
  const url = new URL(`/api/v1${path}`, FINNHUB_BASE_URL)
  url.searchParams.append('token', FINNHUB_TOKEN)
  return url.href
}
