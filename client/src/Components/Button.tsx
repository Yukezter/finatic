/* eslint-disable react/jsx-props-no-spreading */
import withStyles from '@mui/styles/withStyles'
// import { alpha } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import Button from '@mui/material/Button'

export default withStyles(theme =>
  createStyles({
    textPrimary: {
      '&:hover': {
        // backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
        backgroundColor: 'inherit',
        color: theme.palette.primary.dark,
      },
    },
  })
)(Button)
