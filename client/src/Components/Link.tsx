/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import Link, { LinkProps } from '@mui/material/Link'

interface CustomLinkProps extends LinkProps {
  targetBlank?: boolean
}

const targetBlankProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

export default React.forwardRef(
  ({ children, targetBlank = false, ...props }: CustomLinkProps, ref) => {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        color='inherit'
        // underline='hover'
        {...(targetBlank ? targetBlankProps : {})}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
