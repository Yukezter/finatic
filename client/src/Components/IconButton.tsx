import withStyles from '@mui/styles/withStyles'
import IconButton from '@mui/material/IconButton'

export default withStyles(({ palette }) => ({
  root: {
    padding: 4,
    borderRadius: 4,
  },
  colorPrimary: {
    '&:hover': {
      color: palette.primary.dark,
    },
  },
}))(IconButton)
