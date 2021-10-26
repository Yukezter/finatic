/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { LinkProps } from '@mui/material/Link'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

import Link from './Link'

export default React.forwardRef(({ children, ...props }: RouterLinkProps & LinkProps, ref) => {
  return (
    <Link ref={ref} component={RouterLink} {...props}>
      {children}
    </Link>
  )
})
