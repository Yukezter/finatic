import React from 'react'
import { Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from 'react-query'

import { CssBaseline, MuiThemeProvider, makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Header from './Header'
import Market from '../Market'
import News from '../News'
import Company from '../Company'

import theme from '../shared/themes/mui'
// import api from '../shared/hooks/api'

const PUB_KEY = 'pk_585f69b27ed14d70860be420045319d9'
const defaultQueryFn = async ({ queryKey }) => {
  const url = `${queryKey[0]}?token=${PUB_KEY}${queryKey[1] || ''}`
  const { data } = await axios.get(url)
  return data
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      retry: false,
      queryFn: defaultQueryFn,
    },
  },
})

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
  },
  container: {
    paddingTop: spacing(3),
    paddingBottom: spacing(10),
    [breakpoints.up('lg')]: {
      paddingTop: spacing(4),
    },
  },
}))

let count = 0

// const eventSource = new EventSource('/stock/AAPL/quote?symbols=AAPL,TSLA')

// eventSource.onopen = () => {
//   console.log('sdfs')
// }

// eventSource.onmessage = data => {
//   console.log(JSON.parse(data.data))
// }

const App = () => {
  console.log('App:', ++count)

  const classes = useStyles()

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <Header theme={theme} />
          <Toolbar />
          <Container className={classes.container} maxWidth='lg'>
            <Switch>
              <Route
                path='/market'
                render={props => <Market theme={theme} {...props} />}
              />
              <Route
                path='/news'
                render={props => <News theme={theme} {...props} />}
              />
              <Route
                path='/company/:symbol'
                render={props => <Company theme={theme} {...props} />}
              />
            </Switch>
          </Container>
        </div>
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}
export default App
