import React from 'react'

export default (effect: React.EffectCallback, deps: React.DependencyList) => {
  const didMountRef = React.useRef(false)

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (didMountRef.current) {
      return effect()
    }

    didMountRef.current = true
  }, deps)
}
