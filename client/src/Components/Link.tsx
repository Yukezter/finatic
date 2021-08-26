import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiLink, LinkProps } from '@material-ui/core'

interface Props extends LinkProps {
  to: string
}

const Link: React.FC<Props> = ({ children, underline, className = '', to }: Props) => {
  return (
    <MuiLink
      component={RouterLink}
      color='inherit'
      underline={underline}
      className={className}
      to={to}
    >
      {children}
    </MuiLink>
  )
}

export default Link
