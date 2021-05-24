import { useQuery, useMutation } from 'react-query'

import api from '../utils/api'

const _useQuery = (method, url, options = {}) =>
  useQuery(
    url,
    async () => {
      const response = await api[method](url)
      return response.data
    },
    options,
  )

const _useMutation = (method, url, options = {}) =>
  useMutation(async body => {
    const response = await api[method](url, body)
    return response.data
  }, options)

export default {
  get: (...args) => _useQuery('get', ...args),
  post: (...args) => _useMutation('post', ...args),
  delete: (...args) => _useMutation('delete', ...args),
}
