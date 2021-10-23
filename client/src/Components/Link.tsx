import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiLink, LinkProps } from '@mui/material'

interface Props extends LinkProps {
  to: string
}

const Link: React.FC<Props> = ({
  children,
  underline,
  className = '',
  to,
  style,
}: Props) => {
  return (
    <MuiLink
      to={to}
      component={RouterLink}
      color='inherit'
      underline={underline}
      className={className}
      style={style}
    >
      {children}
    </MuiLink>
  )
}

export default Link
