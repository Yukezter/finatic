import React from 'react'
import Button from '@material-ui/core/Button'

const defaultStyles = {
  // padding: 0,
}

const StyledButton = React.forwardRef((props, ref) => {
  return <Button ref={ref} style={defaultStyles} {...props} />
})

export default StyledButton
