import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { CssBaseline, MuiThemeProvider, makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Header from './Header'
import Market from '../Market'
import News from '../News'
import Company from '../Company'

import theme from '../shared/themes/mui'
import api from '../shared/hooks/api'
// import SocketContext from '../shared/context/SocketContext'

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

const eventSource = new EventSource('/stock/AAPL/quote?symbols=AAPL,TSLA')

eventSource.onopen = () => {
  console.log('sdfs')
}

eventSource.onmessage = data => {
  console.log(JSON.parse(data.data))
}

const App = () => {
  console.log('App:', ++count)

  const classes = useStyles()

  return (
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
  )
}
export default App
