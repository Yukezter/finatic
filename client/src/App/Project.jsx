import { makeStyles } from '@material-ui/core'

import { sizes } from '../shared/utils/styles'
import Header from './Header'

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    width: '100vw',
    paddingTop: sizes.headerHeight,
  }
}))

const Project = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Header />
      <div>Body!!!</div>
    </div>
  )
}
export default Project
