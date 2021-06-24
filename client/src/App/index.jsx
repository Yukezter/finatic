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
import Stock from '../Stock'

import theme from '../shared/themes/mui'

const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(queryKey)
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
              <Route path='/market' render={props => <Market theme={theme} {...props} />} />
              <Route path='/news' render={props => <News theme={theme} {...props} />} />
              <Route path='/company/:symbol' render={props => <Stock theme={theme} {...props} />} />
            </Switch>
          </Container>
        </div>
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}
export default App
