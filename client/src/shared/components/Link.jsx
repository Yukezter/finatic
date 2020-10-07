import React from 'react'
import { Link } from 'react-router-dom'
import withStyles from '@material-ui/styles/withStyles'

const StyledLink = withStyles(() => ({
  root: {
    textDecoration: 'none',
    color: 'inherit',
    '&:focus': {
      outline: 0,
    },
  },
}))(({ classes, to, className = '', children }) => {
  return (
    <Link to={to} className={classes.root + ' ' + className}>
      {children}
    </Link>
  )
})

export default StyledLink
