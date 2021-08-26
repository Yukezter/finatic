import 'dotenv/config'

const { IEX_TOKEN } = process.env
const { FINNHUB_TOKEN } = process.env

if (!IEX_TOKEN || !FINNHUB_TOKEN) {
  throw new Error('Missing environment variables.')
}

const createURL = (base: string, token: string, prepath = '') => {
  return (path: string) => {
    const url = new URL(`${prepath}${path}`, base)
    url.searchParams.append('token', token)
    return url.href
  }
}

export default {
  iex: {
    url: createURL('https://cloud.iexapis.com', IEX_TOKEN, '/stable'),
    urlSse: createURL('https://cloud-sse.iexapis.com', IEX_TOKEN, '/stable'),
    token: IEX_TOKEN,
  },
  finnhub: {
    url: createURL('https://finnhub.io', FINNHUB_TOKEN, '/api/v1'),
    token: FINNHUB_TOKEN,
  },
}
