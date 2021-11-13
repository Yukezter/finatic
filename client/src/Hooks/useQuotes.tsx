import React from 'react'

import useEventSource from './useEventSource'

type SymbolData = {
  symbol: string
  quote?: any
}

type UseQuotesState = {
  isLoading: boolean
  data: SymbolData[]
}

export default (url: string, symbols: string[]) => {
  const [state, setState] = React.useState<UseQuotesState>({
    isLoading: true,
    data: [],
  })

  let tempData = React.useMemo<SymbolData[]>(() => {
    return symbols.map(symbol => ({ symbol }))
  }, [symbols])

  const updateData = React.useCallback((data: SymbolData[], quote: any): SymbolData[] => {
    data.map(symbolData => {
      if (symbolData.symbol === quote.symbol) {
        symbolData.quote = quote
      }

      return symbolData
    })

    return data
  }, [])

  const messageEventCallback = React.useCallback(
    (messageEvent: MessageEvent) => {
      const quote = JSON.parse(messageEvent.data)[0]

      if (quote && state.isLoading) {
        tempData = updateData(tempData, quote)

        if (!tempData.find(symbolData => !symbolData.quote)) {
          setState({
            isLoading: false,
            data: tempData.map(symbolData => ({ ...symbolData })),
          })
        }
      } else if (quote) {
        setState(prevState => {
          return {
            ...prevState,
            data: updateData(prevState.data, quote),
          }
        })
      }
    },
    [state.isLoading]
  )

  useEventSource(url, messageEventCallback)

  return state
}
