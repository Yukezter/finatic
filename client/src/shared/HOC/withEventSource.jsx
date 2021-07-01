import { useRef, useReducer, useState, useCallback, useEffect } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        isLoading: true,
        ...state,
      }
    case 'DONE':
      return {
        isLoading: false,
        data: action.payload,
        ...state,
      }
    case 'ERROR':
      return {
        isLoading: false,
        error: true,
        ...state,
      }
    default:
      return state
  }
}

const withEventSource = Component => {
  return ({ path, symbols, ...props }) => {
    const [isError, setIsError] = useState(false)
    const esRef = useRef(new EventSource(`http://localhost:8001/sse${path}?symbols=${symbols}`))

    useEffect(() => {
      const es = esRef.current

      const errorListener = err => {
        console.log(err)
        es.close()

        setIsError(true)
      }

      es.addEventListener('error', errorListener)

      return () => {
        es.removeEventListener('error', errorListener)
        es.close()
      }
    }, [path, symbols])

    const dataListener = useCallback(data => {
      dispatch({ type: 'DONE', payload: JSON.parse(data.data) })
    }, [])

    const useEventState = useCallback(
      (symbol, initialData) => {
        const [state, dispatch] = useReducer(reducer, initialData)

        useEffect(() => {
          const es = esRef.current
          es.addEventListener(symbol, dataListener)

          return () => {
            es.removeEventListener(symbol, dataListener)
          }
        }, [symbol])
      },
      [dataListener],
    )

    return <Component isError={isError} useEventState={useEventState} {...props} />
  }
}
