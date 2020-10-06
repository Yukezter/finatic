import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, MuiThemeProvider } from '@material-ui/core'

import { lightTheme } from '../shared/themes/mui'
import Root from './Root'

const App = () => {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Root />
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default App
