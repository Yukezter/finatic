import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, CssBaseline } from '@material-ui/core'
import { QueryClient, QueryClientProvider, QueryFunction } from 'react-query'
import axios, { AxiosResponse } from 'axios'

import theme from '../theme'
import App from './App'

interface QueryPromise extends Promise<AxiosResponse> {
  cancel?: () => void
}

const defaultQueryFn: QueryFunction<unknown, any> = ({ queryKey }: { queryKey: string[] }) => {
  const { CancelToken } = axios
  const source = CancelToken.source()

  const promise: QueryPromise = axios.get(queryKey[0], {
    cancelToken: source.token,
  })

  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query')
    console.log('wowowow')
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

const AppContainer = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  )
}

export default AppContainer
