import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { QueryClient, QueryClientProvider, QueryFunction } from 'react-query'

import App from './App'
import reportWebVitals from './reportWebVitals'

interface QueryPromise extends Promise<AxiosResponse> {
  cancel?: () => void
}

const defaultQueryFn: QueryFunction<unknown, any> = ({
  queryKey,
}: {
  queryKey: string[]
}) => {
  const { CancelToken } = axios
  const source = CancelToken.source()

  const promise: QueryPromise = axios.get(queryKey[0], {
    cancelToken: source.token,
  })

  promise.cancel = () => {
    source.cancel(`Requst to: ${queryKey[0]} has been canceled.`)
    console.log(`Requst to: ${queryKey[0]} has been canceled.`)
  }

  return promise
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      cacheTime: 0,
      retry: false,
    },
  },
})

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
