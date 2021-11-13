/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'

import { light, dark } from '../theme'
import App from './App'

const timeZone = 'America/New_York'

type MarketTimes = {
  open: number
  earlyClose: number
  close: number
}

// 09:30, 13:00, 16:00
/* Event timestamps */
// const getMarketTimes = (est: Date): MarketTimes => {
//   const d = `${est.getFullYear()}-${est.getMonth() + 1}-${est.getDate()}`
//   return {
//     open: zonedTimeToUtc(`${d} 09:30:00`, timeZone).getTime(),
//     earlyClose: zonedTimeToUtc(`${d} 13:00:00`, timeZone).getTime(),
//     close: zonedTimeToUtc(`${d} 16:00:00`, timeZone).getTime(),
//   }
// }

const getMarketTimes = (est: Date): MarketTimes => {
  const d = `${est.getFullYear()}-${est.getMonth() + 1}-${est.getDate()}`
  return {
    open: zonedTimeToUtc(`${d} 20:31`, timeZone).getTime(),
    earlyClose: zonedTimeToUtc(`${d} 13:00`, timeZone).getTime(),
    close: zonedTimeToUtc(`${d} 20:32`, timeZone).getTime(),
  }
}

type GlobalState = {
  initialLoading: boolean
  isMarketOpen?: boolean
}

export default () => {
  const [{ initialLoading, isMarketOpen }, setGlobalState] = React.useState<GlobalState>({
    initialLoading: true,
  })

  React.useEffect(() => {
    if (isMarketOpen !== undefined) {
      console.log('set timeout')
      setTimeout(() => {
        setGlobalState(prevState => ({
          ...prevState,
          initialLoading: false,
        }))
      }, 5000)
    }
  }, [isMarketOpen])

  const { refetch } = useQuery('/market-status', {
    enabled: false,
    onSuccess: (response: AxiosResponse<{ isUSMarketOpen: boolean }>) => {
      console.log('isUSMarketOpen', response.data.isUSMarketOpen)
      setGlobalState(prevState => ({
        ...prevState,
        isMarketOpen: response.data.isUSMarketOpen,
      }))
    },
  })

  React.useEffect(() => {
    refetch()
  }, [])

  /* Recursively check if US stock market is open at:
  9:30AM, 1:00PM (early close on holidays), and 4:00PM EST */
  React.useEffect(() => {
    const est = utcToZonedTime(new Date(), timeZone)
    let marketTimes = getMarketTimes(est)

    const msUntilNextEvent = (): number => {
      console.log('now', new Date())
      const now = new Date().getTime()

      if (now < marketTimes.open) {
        return marketTimes.open - now
      }

      if (now < marketTimes.earlyClose) {
        return marketTimes.earlyClose - now
      }

      if (now < marketTimes.close) {
        return marketTimes.close - now
      }

      est.setHours(est.getHours() + 24)
      marketTimes = getMarketTimes(est)
      return marketTimes.open - now
    }

    let timeoutID: any

    const fetch = () => {
      refetch()
      const delay = msUntilNextEvent()
      console.log(delay / 1000 / 60)
      timeoutID = setTimeout(fetch, delay)
    }

    const delay = msUntilNextEvent()
    console.log(delay / 1000 / 60)
    timeoutID = setTimeout(fetch, delay)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [])

  const theme = React.useMemo(() => {
    if (initialLoading) {
      return dark
    }

    return isMarketOpen ? light : dark
  }, [initialLoading, isMarketOpen])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App isLoading={initialLoading} />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
