import withStyles from '@mui/styles/withStyles';
import IconButton from '@mui/material/IconButton'

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
