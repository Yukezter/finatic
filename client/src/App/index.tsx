import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider, QueryFunction } from 'react-query'
import axios, { AxiosResponse } from 'axios'

import { light } from '../theme'
import App from './App'

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

const AppContainer = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={light}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default AppContainer
