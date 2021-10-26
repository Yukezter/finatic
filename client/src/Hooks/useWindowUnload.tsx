import React from 'react'

export default (handler: () => void) => {
  const callback = React.useRef(handler)

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      callback.current()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}
