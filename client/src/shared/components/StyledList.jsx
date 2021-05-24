import React from 'react'
import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'

const StyledList = withStyles(theme => ({
  subheader: {
    fontSize: theme.typography.h6.fontSize,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
}))(({ classes, ariaLabelledBy, subheader, children }) => (
  <List
    aria-labelledby={ariaLabelledBy}
    subheader={
      <ListSubheader
        className={classes.subheader}
        id={ariaLabelledBy}
        disableGutters
      >
        {subheader}
      </ListSubheader>
    }
    dense
  >
    {children}
  </List>
))

export default StyledList
