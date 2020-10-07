import axios from 'axios'

const headers = () => ({
  'Content-Type': 'application/json',
})

const api = (method, url, data = {}) =>
  axios({
    headers: headers(),
    method,
    url,
    data,
  })

export default {
  get: (...args) => api('get', ...args),
  post: (...args) => api('post', ...args),
  put: (...args) => api('put', ...args),
  delete: (...args) => api('delete', ...args),
}
