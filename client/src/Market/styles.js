import { makeStyles } from '@material-ui/core'

export default makeStyles(({ spacing }) => ({
  root: {
    '& ul': {
      '& > li > p:first-child': {
        flexGrow: 1,
      },
      '& > li > *': {
        // padding: `${spacing(0.5)}px`,
      },
    },
  },
}))
