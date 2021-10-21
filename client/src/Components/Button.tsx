/* eslint-disable react/jsx-props-no-spreading */
// import React from 'react'
import { withStyles, createStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'

export default withStyles(() =>
  createStyles({
    root: {
      color: 'inherit',
    },
  })
)(Button)
