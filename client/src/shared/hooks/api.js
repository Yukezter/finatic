/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, useMutation } from 'react-query'

import api from '../utils/api'

const query = (method, url, options = {}) =>
  useQuery(
    url,
    async () => {
      const response = await api[method](url)
      return response.data
    },
    options
  )

const mutate = (method, url, options = {}) =>
  useMutation(async body => {
    const response = await api[method](url, body)
    return response.data
  }, options)

export default {
  get: (...args) => query('get', ...args),
  post: (...args) => mutate('post', ...args),
  delete: (...args) => mutate('delete', ...args),
}
