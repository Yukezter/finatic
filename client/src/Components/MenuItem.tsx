import withStyles from '@mui/styles/withStyles'
import MenuItem from '@mui/material/MenuItem'

export default withStyles(theme => ({
  selected: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: `${theme.palette.action.selected} !important`,
    },
  },
}))(MenuItem)
