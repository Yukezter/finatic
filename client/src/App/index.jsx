import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, MuiThemeProvider } from '@material-ui/core'

import theme from '../shared/themes/mui'
import App from './App'

const AppContainer = () => {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default AppContainer
