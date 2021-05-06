import React from 'react'
import _ from 'lodash'

const useWindowSize = (wait = 50) => {
  const [size, setSize] = React.useState([window.innerWidth, window.innerHeight])

  React.useLayoutEffect(() => {
    const updateSize = _.throttle(() => {
      setSize([window.innerWidth, window.innerHeight])
    }, wait)

    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [wait])
  return size
}

export default useWindowSize
