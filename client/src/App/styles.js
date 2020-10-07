import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    position: 'relative',
    '& > main > .route-wrapper': {
      display: 'flex',
    },
  },
}))
