import React from 'react'
import { useSnackbar } from 'notistack'

type UseEventSourceOptions = {
  errorSnackbar?: boolean
  errorMessage?: string
}

export default (
  endpoint: string,
  messageEventCallback: (event: MessageEvent) => void,
  options: UseEventSourceOptions = {}
) => {
  const { errorSnackbar = false, errorMessage = 'Oops, something went wrong!' } = options
  const { enqueueSnackbar } = useSnackbar()

  const esRef = React.useRef<EventSource>()

  React.useEffect(() => {
    const es = new EventSource(`/sse${endpoint}`)
    esRef.current = es

    es.onerror = () => {
      es.close()

      if (errorSnackbar) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      }
    }

    return () => {
      es.close()
      esRef.current = undefined
    }
  }, [])

  React.useEffect(() => {
    const es = esRef.current

    if (es) {
      es.onmessage = event => {
        messageEventCallback(event)
      }
    }
  }, [messageEventCallback])
}
