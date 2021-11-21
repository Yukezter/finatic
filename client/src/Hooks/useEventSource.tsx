import React from 'react'
import { useSnackbar } from 'notistack'

type UseEventSourceOptions = {
  enabled?: boolean
  errorSnackbar?: boolean
  errorMessage?: string
}

export default (
  endpoint: string | undefined,
  messageEventCallback: (event: MessageEvent) => void,
  options: UseEventSourceOptions = {}
) => {
  const {
    enabled = true,
    errorSnackbar = false,
    errorMessage = 'Oops, something went wrong!',
  } = options
  const { enqueueSnackbar } = useSnackbar()

  const esRef = React.useRef<EventSource>()

  React.useEffect(() => {
    let es: EventSource

    if (endpoint && enabled) {
      es = new EventSource(`/sse${endpoint}`)
      esRef.current = es

      es.onerror = () => {
        es.close()

        if (errorSnackbar) {
          enqueueSnackbar(errorMessage, { variant: 'error' })
        }
      }
    }

    return () => {
      if (es) {
        es.close()
        esRef.current = undefined
      }
    }
  }, [endpoint, enabled])

  React.useEffect(() => {
    const es = esRef.current

    if (es) {
      es.onmessage = event => {
        messageEventCallback(event)
      }
    }
  }, [messageEventCallback])
}
