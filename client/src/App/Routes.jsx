import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Market from '../Market'
import News from '../News'
import Company from '../Company'

const Routes = () => {
  return (
    <Switch>
      <Route path='/' exact render={() => <></>} />
      <Route path='/market' exact component={Market} />
      <Route path='/news' exact component={News} />
      <Route path='/company/:symbol' exact component={Company} />
    </Switch>
  )
}

export default Routes
