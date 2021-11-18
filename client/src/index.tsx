import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider, QueryFunction } from 'react-query'

import App from './App'
import reportWebVitals from './reportWebVitals'

const defaultQueryFn: QueryFunction<any> = async ({ queryKey, signal }) => {
  const response = await axios.get(`/api${queryKey[0] as string}`, {
    signal,
  })

  return response.data
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
