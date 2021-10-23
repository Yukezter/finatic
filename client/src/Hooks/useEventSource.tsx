import React from 'react'

type SymbolData<T> = T & { data: any }

const useEventSource = <T extends { readonly symbol: string }>(
  url: string,
  symbols: T | T[] | undefined
): { isLoading: boolean; data: SymbolData<T>[] } => {
  const initialData: SymbolData<T>[] = React.useMemo(() => {
    if (!symbols) return []
    return [...(Array.isArray(symbols) ? symbols : [symbols])].map(symbol => ({
      ...symbol,
      data: undefined,
    }))
  }, [symbols])

  const [state, setState] = React.useState({
    data: initialData,
    isLoading: true,
  })

  const rendered = React.useRef(false)

  React.useEffect(() => {
    if (rendered.current) {
      setState({
        data: initialData,
        isLoading: true,
      })
    } else {
      rendered.current = true
    }
  }, [initialData])

  // const getUpdatedList = React.useCallback(
  //   (list: SymbolData<T>[], data: any) => {
  //     return list.map(value => {
  //       if (value.symbol === data.symbol) {
  //         value.data = data
  //       }
  //       return value
  //     })
  //   },
  //   []
  // )

  // const updateList = React.useCallback((quote: any) => {
  //   setState(prevState => ({
  //     ...prevState,
  //     data: getUpdatedList(prevState.data, quote),
  //   }))
  // }, [])

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    let es: EventSource

    const getUpdatedList = (list: SymbolData<T>[], data: any) => {
      return list.map(value => {
        if (value.symbol === data.symbol) {
          value.data = data
        }
        return value
      })
    }

    const updateList = (quote: any) => {
      setState(prevState => ({
        ...prevState,
        data: getUpdatedList(prevState.data, quote),
      }))
    }

    const handleData = ({ data }: any) => {
      updateList(JSON.parse(data)[0])
    }

    const itemsLoaded = new Set()

    const handleLoading = ({ data }: any) => {
      const quote = JSON.parse(data)[0]
      itemsLoaded.add(quote.symbol)

      if (itemsLoaded.size === state.data.length) {
        setState(prevState => ({
          isLoading: false,
          data: getUpdatedList(prevState.data, quote),
        }))

        es.removeEventListener('message', handleLoading)
        es.addEventListener('message', handleData)
      } else {
        updateList(quote)
      }
    }

    const closeConnection = () => {
      es.removeEventListener('message', handleLoading)
      es.removeEventListener('message', handleData)
      es.close()
    }

    if (initialData.length) {
      es = new EventSource(url)
      es.onerror = closeConnection
      es.addEventListener('message', handleLoading)
    }

    return () => {
      if (es) {
        closeConnection()
      }
    }
  }, [initialData])

  return state
}

export default useEventSource
