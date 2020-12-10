import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, MuiThemeProvider } from '@material-ui/core'

import theme from '../shared/themes/mui'
import Project from './Project'

const App = () => {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Project />
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default App
