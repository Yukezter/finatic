import { useState, useEffect } from 'react'

const useEventListener = (eventSource, event) => {
  const [state, setState] = useState({ isLoading: true, data: null })

  useEffect(() => {
    const listener = data => {
      setState({ isLoading: false, data: JSON.parse(data.data) })
    }

    eventSource.addEventListener(event, listener)

    return () => {
      eventSource.removeEventListener(event, listener)
    }
  }, [eventSource, event])

  return state
}

export default useEventListener
