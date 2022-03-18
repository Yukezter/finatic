import React from 'react'

import useEventSource from './useEventSource'

type UserSymbol<T> = { symbol: string } & T

interface SymbolData<T> {
  symbol: string
  data?: any
  props: Omit<UserSymbol<T>, 'symbol'>
}

type UseQuotesState<T> = {
  isLoading: boolean
  data: SymbolData<T>[]
}

type UseQuoteOptions = {
  errorSnackbar?: boolean
  errorMessage?: string
}

export default <T extends { [key: string]: any }>(
  endpoint: string,
  userSymbols: UserSymbol<T>[],
  options?: UseQuoteOptions
) => {
  const [state, setState] = React.useState<UseQuotesState<T>>({
    isLoading: true,
    data: userSymbols.map(({ symbol, ...props }) => ({ symbol, props })),
  })

  const updateData = React.useCallback(
    (data: SymbolData<T>[], quote: any): SymbolData<T>[] => {
      data.map(symbolData => {
        if (symbolData.symbol === quote.symbol) {
          symbolData.data = quote
        }

        return symbolData
      })

      return data
    },
    []
  )

  const messageEventCallback = React.useCallback(
    (messageEvent: MessageEvent) => {
      const quote = JSON.parse(messageEvent.data)[0]

      if (quote) {
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

  useEventSource(
    `${endpoint}?symbols=${userSymbols.map(({ symbol }) => symbol).join(',')}`,
    messageEventCallback,
    options
  )

  return state
}
