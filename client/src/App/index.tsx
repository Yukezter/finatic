import React from 'react'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'

import { light, dark } from '../theme'
import App from './App'

const AppContainer = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    setTimeout(() => {
      setMode('dark')
    }, 10000)
  }, [])

  const theme = React.useMemo(() => {
    return mode === 'light' ? light : dark
  }, [mode])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default AppContainer
