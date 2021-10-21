import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'

export default withStyles(({ palette }) => ({
  root: {
    padding: 0,
    borderRadius: 4,
    '&:hover': {
      background: 'initial',
    },
  },
  colorPrimary: {
    '&:hover': {
      color: palette.primary.dark,
    },
  },
}))(IconButton)
