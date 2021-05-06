import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { makeStyles, useTheme } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Header from './Header'
import Market from '../Market'
import News from '../News'
import Company from '../Company'

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
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
    [breakpoints.up('xl')]: {
      paddingTop: spacing(4),
    },
  },
}))

let count = 0

const Project = () => {
  console.log('project:', ++count)

  const theme = useTheme()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Header theme={theme} />
      <Toolbar />
      <Container className={classes.container} maxWidth='lg'>
        <Switch>
          <Route
            path='/market'
            render={props => <Market theme={theme} {...props} />}
          />
          <Route path='/news' render={props => <News theme={theme} {...props} />} />
          <Route
            path='/company/:symbol'
            render={props => <Company theme={theme} {...props} />}
          />
        </Switch>
      </Container>
    </div>
  )
}
export default Project
