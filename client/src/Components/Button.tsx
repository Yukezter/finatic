/* eslint-disable react/jsx-props-no-spreading */
import withStyles from '@mui/styles/withStyles'

import createStyles from '@mui/styles/createStyles'
import Button from '@mui/material/Button'

export default withStyles(() =>
  createStyles({
    root: {
      color: 'inherit',
    },
  })
)(Button)
