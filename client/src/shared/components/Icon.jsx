import React from 'react'
import Box from '@material-ui/core/Box'

const Icon = ({ icon: Icon, width = 24, height = 24, className = '' }) => {
  return (
    <Box className={className} width={width} height={height} color='inherit'>
      <Icon fill='currentColor' />
    </Box>
  )
}

export default Icon
