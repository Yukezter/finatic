import React from 'react'

import useWindowSize from './useWindowSize'

const useUnderBreakpoint = (breakpoint, wait = 100) => {
  const initialState = window.innerWidth < breakpoint
  const [isUnder, setIsUnder] = React.useState(initialState)
  const flag = React.useRef(initialState)

  const [innerWidth] = useWindowSize(wait)

  React.useLayoutEffect(() => {
    if (innerWidth < breakpoint && !flag.current) {
      flag.current = true
      setIsUnder(true)
    } else if (innerWidth >= breakpoint && flag.current) {
      flag.current = false
      setIsUnder(false)
    }
  }, [innerWidth, breakpoint, wait])

  return isUnder
}

export default useUnderBreakpoint
