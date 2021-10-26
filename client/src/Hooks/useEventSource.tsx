import React from 'react'

// import useWindowUnload from './useWindowUnload'

type SymbolData<T> = T & { data: any }

const useEventSource = <T extends { readonly symbol: string }>(
  url: string,
  symbols: T | T[] | undefined
): { isLoading: boolean; data: SymbolData<T>[] } => {
  const initialData: SymbolData<T>[] = React.useMemo(() => {
    if (!symbols) return []
    return (Array.isArray(symbols) ? symbols : [symbols]).map(symbol => ({
      ...symbol,
      data: undefined,
    }))
  }, [symbols])

  const [state, setState] = React.useState({
    data: [...initialData],
    isLoading: true,
  })

  const rendered = React.useRef(false)

  React.useEffect(() => {
    if (rendered.current) {
      setState({
        data: [...initialData],
        isLoading: true,
      })
    } else {
      rendered.current = true
    }
  }, [initialData])

  console.log('rendering', initialData)

  React.useEffect(() => {
    let es: EventSource
    console.log('useEventSource useEffect')

    const getUpdatedList = (list: SymbolData<T>[], data: any) => {
      return list.map(value => {
        const newValue = {
          ...value,
        }

        if (value.symbol === data.symbol) {
          newValue.data = data
        }

        return newValue
      })
    }

    const updateList = (quote: any) => {
      setState(prevState => ({
        ...prevState,
        data: getUpdatedList(prevState.data, quote),
      }))
    }

    const handleData = ({ data }: any) => {
      console.log('WTF!!!')
      updateList(JSON.parse(data)[0])
    }

    const symbolsLoadedSet = new Set()
    let tempSymbolsData = [...initialData]

    const handleLoading = ({ data }: any) => {
      const quote = JSON.parse(data)[0]
      symbolsLoadedSet.add(quote.symbol)
      console.log('useEventSource useEffect handleLoading')

      if (symbolsLoadedSet.size === initialData.length) {
        console.log('useEventSource useEffect loaded')

        setState({
          isLoading: false,
          data: getUpdatedList(tempSymbolsData, quote),
        })

        es.removeEventListener('message', handleLoading)
        es.addEventListener('message', handleData)
      } else {
        tempSymbolsData = getUpdatedList(tempSymbolsData, quote)
      }
    }

    const closeConnection = () => {
      if (es) {
        console.log('closed')
        es.removeEventListener('message', handleLoading)
        es.removeEventListener('message', handleData)
        es.close()
      }
    }

    if (initialData.length) {
      console.log(initialData.length)
      es = new EventSource(url)
      es.onerror = closeConnection
      es.addEventListener('message', handleLoading)
    }

    const handleBeforeUnload = () => {
      closeConnection()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      closeConnection()

      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [initialData])

  return state
}

export default useEventSource
