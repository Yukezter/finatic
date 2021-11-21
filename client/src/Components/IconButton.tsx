import withStyles from '@mui/styles/withStyles'
import IconButton from '@mui/material/IconButton'

export default withStyles(theme => ({
  root: {
    padding: 6,
    borderRadius: 4,
    color: 'inherit',
  },
  colorPrimary: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}))(IconButton)
