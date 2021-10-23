/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames'
import { styled } from '@mui/material/styles'
import { OutlinedInputProps } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'

const PREFIX = 'Input'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  [`&.${classes.root}`]: {
    height: 36,
  },
}))

export default (props: OutlinedInputProps) => {
  const { className, ...rest } = props

  return (
    <StyledOutlinedInput
      className={classNames(className, classes.root)}
      fullWidth
      {...rest}
    />
  )
}
