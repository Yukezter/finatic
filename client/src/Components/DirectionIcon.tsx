/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import Icon from './Icon'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  value?: number
  title?: string
}

export default ({ value = 1, ...props }: IconProps) => (
  <Icon
    name='direction'
    height={10}
    width={10}
    style={{
      marginRight: 8,
      marginTop: -2,
      color: `var(--${value >= 0 ? 'green' : 'red'})`,
      transform: `rotate(${value >= 0 ? 0 : 180}deg)`,
    }}
    {...props}
  />
)
