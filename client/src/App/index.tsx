/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { useQueries } from 'react-query'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'

import { yyyymmdd } from '../Utils'
import { defaultGlobalState, GlobalContext, GlobalState } from '../Context/Global'
import { light, dark } from '../theme'
import App from './App'

const timeZone = 'America/New_York'

type MarketTimes = {
  open: number
  earlyClose: number
  close: number
}

/* Market event times (9:30AM, 1:00PM, 4:00PM EST) */
const getMarketTimes = (date: Date): MarketTimes => {
  const formatted = yyyymmdd(date, '-')
  return {
    open: zonedTimeToUtc(`${formatted} 09:30:00`, timeZone).getTime(),
    earlyClose: zonedTimeToUtc(`${formatted} 13:00:00`, timeZone).getTime(),
    close: zonedTimeToUtc(`${formatted} 16:00:00`, timeZone).getTime(),
  }
}

export default () => {
  const [globalState, setGlobalState] = React.useState<GlobalState>(defaultGlobalState)

  const queries = useQueries([
    {
      queryKey: '/next-holiday-date',
      enabled: false,
      select: (data: any) => data[0].date,
    },
    {
      queryKey: '/ref-data/symbols',
      refetchInterval: 10 * 60 * 1000,
      refetchIntervalInBackground: true,
      onSuccess: (data: any) => {
        setGlobalState(prevState => ({
          ...prevState,
          refSymbolsMap: new Map(
            (data as any[]).map(({ symbol, ...rest }) => {
              return [symbol, rest]
            })
          ),
        }))
      },
    },
  ])

  const allQueriesSuccessful = queries.every(query => query.isSuccess)
  const { initialLoading, isMarketOpen } = globalState

  React.useEffect(() => {
    if (initialLoading && isMarketOpen !== undefined && allQueriesSuccessful) {
      setTimeout(() => {
        setGlobalState(prevState => ({
          ...prevState,
          initialLoading: false,
        }))
      }, 3000)
    }
  }, [initialLoading, isMarketOpen, allQueriesSuccessful])

  const theme = React.useMemo(() => {
    if (initialLoading) {
      return dark
    }

    return isMarketOpen ? light : dark
  }, [initialLoading, isMarketOpen])

  const {
    isLoading: isLoadingNextHoliday,
    data: nextHolidayDate,
    refetch: fetchNextHolidayDate,
  } = queries[0]

  React.useEffect(() => {
    const est = utcToZonedTime(new Date(), timeZone)
    const midnightEst = zonedTimeToUtc(`${yyyymmdd(est, '-')} 00:00`, timeZone)

    const msUntilMidnightEst = () => {
      const now = new Date().getTime()
      return midnightEst.setDate(midnightEst.getHours() + 24) - now
    }

    let timeoutID: any

    /* Refetch next holiday date at midnight EST of every day */
    const atMidnightEst = () => {
      fetchNextHolidayDate()
      timeoutID = setTimeout(atMidnightEst, msUntilMidnightEst())
    }

    timeoutID = setTimeout(atMidnightEst, msUntilMidnightEst())

    /* Fetch next holiday date */
    fetchNextHolidayDate()

    return () => {
      clearTimeout(timeoutID)
    }
  }, [])

  const marketStatusLoaded = React.useRef(false)

  React.useEffect(() => {
    let timeoutID: any

    const est = utcToZonedTime(new Date(), timeZone)
    let marketTimes = getMarketTimes(est)

    /* Get ms until next market event: open, early close, or regular close time */
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

      /* If all events have passed, move all market times a day forward */
      est.setHours(est.getHours() + 24)
      marketTimes = getMarketTimes(est)

      return marketTimes.open - now
    }

    const setMarketStatus = () => {
      const { open, earlyClose, close } = marketTimes

      const now = new Date().getTime()
      const isWeekday = est.getDate() !== 0 && est.getDate() !== 6
      const isHoliday = yyyymmdd(est, '-') === nextHolidayDate
      const isMarketHours = now >= open && now < (isHoliday ? earlyClose : close)

      if (isWeekday && isMarketHours) {
        setGlobalState(prevState => ({
          ...prevState,
          isMarketOpen: true,
        }))
      } else {
        setGlobalState(prevState => ({
          ...prevState,
          isMarketOpen: false,
        }))
      }
    }

    /* Set market status at every event time */
    const onMarketEvent = () => {
      setMarketStatus()
      timeoutID = setTimeout(onMarketEvent, msUntilNextEvent())
    }

    timeoutID = setTimeout(onMarketEvent, msUntilNextEvent())

    /* Set market status */
    if (!marketStatusLoaded.current && !isLoadingNextHoliday) {
      marketStatusLoaded.current = true
      setMarketStatus()
    }

    return () => {
      clearTimeout(timeoutID)
    }
  }, [isLoadingNextHoliday, nextHolidayDate])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalContext.Provider value={globalState}>
          <App isLoading={initialLoading} />
        </GlobalContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
