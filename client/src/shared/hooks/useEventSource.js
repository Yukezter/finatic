import { useRef, useEffect } from 'react'

const useEventSource = path => {
  const eventSourceRef = useRef(new EventSource(`http://localhost:8001/sse${path}`))

  useEffect(() => {
    const eventSource = eventSourceRef.current

    const onerror = error => {
      console.log(error)
      eventSource.close()
    }

    eventSource.addEventListener('error', onerror)

    return () => {
      eventSource.close()
      eventSource.removeEventListener('error', onerror)
    }
  }, [path])

  return eventSourceRef.current
}

export default useEventSource
