import React from 'react'
import _ from 'lodash'

const useMergeState = (initialState = {}) => {
  const [state, setState] = React.useState(initialState)

  const mergeState = React.useCallback(newState => {
    if (_.isFunction(newState)) {
      setState(currentState => ({
        ...currentState,
        ...newState(currentState),
      }))
    } else {
      setState(currentState => ({
        ...currentState,
        ...newState,
      }))
    }
  }, [])

  return [state, mergeState]
}

export default useMergeState
