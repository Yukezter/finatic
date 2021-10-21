import React from 'react'

const useEventSource = (url: string, initialData: any[]) => {
  const [state, setState] = React.useState({
    data: [...initialData],
    isLoading: true,
  })

  React.useEffect(() => {
    const es = new EventSource(url)

    es.onerror = () => {
      es.close()
    }

    const getUpdatedList = (list: any[], data: any) => {
      return list.map((value: any) => {
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

    es.addEventListener('message', handleLoading)
    return () => {
      es.removeEventListener('message', handleLoading)
      es.removeEventListener('message', handleData)
      es.close()
    }
  }, [])

  return state
}

export default useEventSource
