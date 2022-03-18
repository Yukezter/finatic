/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { LinkProps } from '@mui/material/Link'
import { NavLink, NavLinkProps } from 'react-router-dom'

import Link from './Link'

export default React.forwardRef(({ children, ...props }: NavLinkProps & LinkProps, ref) => {
  return (
    <Link ref={ref} component={NavLink} {...props}>
      {children}
    </Link>
  )
})
