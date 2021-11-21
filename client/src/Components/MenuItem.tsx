import withStyles from '@mui/styles/withStyles'
import { alpha } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'

export default withStyles(theme => ({
  selected: {
    backgroundColor: `${theme.palette.action.selected} !important`,
    '&:hover': {
      backgroundColor: `${alpha(theme.palette.action.selected, 0.24)} !important`,
    },
  },
}))(MenuItem)
