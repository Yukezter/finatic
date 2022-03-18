import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const { TOKEN, SANDBOX_TOKEN } = process.env

const subdomain = SANDBOX_TOKEN ? 'sandbox' : 'cloud'
const token = SANDBOX_TOKEN || TOKEN

if (!token) {
  throw new Error('Missing API token!')
}

const api = axios.create({
  baseURL: `https://${subdomain}.iexapis.com/stable`,
  params: { token },
  responseType: 'stream',
})

const sse = axios.create({
  baseURL: `https://${subdomain}-sse.iexapis.com/stable`,
  params: { token },
  responseType: 'stream',
})

;[api, sse].forEach(instance => {
  instance.interceptors.request.use(config => {
    console.log('Request date:', new Date())
    console.log('Request config', config)
    return config
  })

  instance.interceptors.response.use(response => {
    console.log('Response header date:', response.headers.date)
    return response
  })
})

export default {
  api,
  sse,
}
