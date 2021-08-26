import React from 'react'
import { ButtonBase as MuiButton, ButtonBaseProps } from '@material-ui/core'

const Button: React.FC<ButtonBaseProps> = ({
  children,
  className = '',
  onClick,
}: ButtonBaseProps) => {
  return (
    <MuiButton color='inherit' className={className} onClick={onClick}>
      {children}
    </MuiButton>
  )
}

export default Button
