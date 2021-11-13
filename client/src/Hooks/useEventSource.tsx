import React from 'react'

export default (url: string, messageEventCallback: (event: MessageEvent) => void) => {
  const esRef = React.useRef<EventSource>()

  React.useEffect(() => {
    const es = new EventSource(url)
    esRef.current = es

    es.onerror = () => {
      es.close()
    }

    return () => {
      es.close()
      esRef.current = undefined
    }
  }, [])

  React.useEffect(() => {
    if (esRef.current) {
      esRef.current.onmessage = event => {
        messageEventCallback(event)
      }
    }
  }, [messageEventCallback])
}

// type SymbolData<T> = T & { data: any }

// type State<T> = {
//   data: SymbolData<T>[]
//   isLoading: boolean
// }

// const useEventSource = <T extends { readonly symbol: string }>(
//   url: string,
//   symbolsData: T | T[]
// ): { isLoading: boolean; data: SymbolData<T>[] } => {
//   const [state, setState] = React.useState<State<T>>({
//     data: (Array.isArray(symbolsData) ? symbolsData : [symbolsData]).map((v: T) => ({
//       ...v,
//       data: undefined,
//     })),
//     isLoading: true,
//   })

//   React.useEffect(() => {
//     const es = new EventSource(url)

//     console.log('useEventSource useEffect')

//     const getUpdatedList = (list: SymbolData<T>[], data: any) => {
//       return list.map(value => {
//         const newValue = {
//           ...value,
//         }

//         if (value.symbol === data.symbol) {
//           newValue.data = data
//         }

//         return newValue
//       })
//     }

//     const updateList = (quote: any) => {
//       setState(prevState => ({
//         ...prevState,
//         data: getUpdatedList(prevState.data, quote),
//       }))
//     }

//     const handleData = ({ data }: any) => {
//       console.log('WTF!!!')
//       updateList(JSON.parse(data)[0])
//     }

//     let loadedSymbolsData = (Array.isArray(symbolsData) ? symbolsData : [symbolsData]).map(
//       (v: T) => ({ ...v, data: undefined })
//     )
//     const handleLoading = ({ data }: any) => {
//       const quote = JSON.parse(data)[0]
//       console.log('useEventSource useEffect handleLoading', quote)

//       if (!loadedSymbolsData.find(v => !v.data)) {
//         console.log('useEventSource useEffect loaded', state.data, loadedSymbolsData)

//         setState({
//           isLoading: false,
//           data: getUpdatedList(loadedSymbolsData, quote),
//         })

//         es.removeEventListener('message', handleLoading)
//         es.addEventListener('message', handleData)
//       } else {
//         loadedSymbolsData = getUpdatedList(loadedSymbolsData, quote)
//       }
//     }

//     const closeConnection = () => {
//       if (es) {
//         console.log('closed')
//         es.removeEventListener('message', handleLoading)
//         es.removeEventListener('message', handleData)
//         es.close()
//       }
//     }

//     es.onerror = closeConnection
//     es.addEventListener('message', handleLoading)

//     const handleBeforeUnload = () => {
//       closeConnection()
//     }

//     window.addEventListener('beforeunload', handleBeforeUnload)

//     return () => {
//       closeConnection()
//       window.removeEventListener('beforeunload', handleBeforeUnload)
//     }
//   }, [])

//   return state
// }

// export default useEventSource
