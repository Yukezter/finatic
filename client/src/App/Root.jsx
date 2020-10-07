import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'

import Header from './Header'
import Routes from './Routes'
import useStyles from './styles'

const Main = () => {
  const { root } = useStyles()

  return (
    <div className={root}>
      <Header />
      <Toolbar />
      <main>
        <Routes />
      </main>
    </div>
  )
}

export default Main
