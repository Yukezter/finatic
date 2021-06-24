const IEX_BASE_URL = 'https://cloud.iexapis.com'
const IEX_SANDBOX_URL = 'https://sandbox.iexapis.com'
const { IEX_TOKEN = '', IEX_SANDBOX_TOKEN = '' } = process.env

export const getIEXUrl = (path: string): URL => {
  return new URL(`/stable${path}`, IEX_SANDBOX_TOKEN ? IEX_SANDBOX_URL : IEX_BASE_URL)
}

export const addToken = (url: URL): URL => {
  url.searchParams.append('token', IEX_SANDBOX_TOKEN || IEX_TOKEN)
  return url
}
