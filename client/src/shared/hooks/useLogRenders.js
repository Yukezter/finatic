import React from 'react'

const useLogRenders = state => {
  const renders = React.useRef(0)

  React.useEffect(() => {
    console.log('Renders: ', ++renders.current)

    if (!state) return

    console.log('State: ', state)
  })
}

export default useLogRenders
