import React from 'react'
import Button from '@material-ui/core/Button'

const defaultStyles = {
  // padding: 0,
}

const StyledButton = React.forwardRef((props, ref) => {
  return <Button ref={ref} {...props} style={defaultStyles} />
})

export default StyledButton
