// import axios from 'axios'
import { Switch, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import Header from './Header'

const styles = withStyles(theme => {
  const { palette } = theme
  return {
    root: {
      background: palette.secondary.main,
      height: '100vh',
    },
  }
})

const App = styles((props: any) => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <Header />
      <Switch>
        <Route path='/' exact />
      </Switch>
    </div>
  )
})

export default App
