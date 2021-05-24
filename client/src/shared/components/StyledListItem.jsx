import React from 'react'
import { withStyles } from '@material-ui/core'
import clsx from 'clsx'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const StyledListItem = withStyles(theme => ({
  listItem: {
    '& > div:last-child': {
      marginLeft: 'auto',
    },
  },
  title: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: 600,
  },
  titleSecondary: {
    lineHeight: 1,
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
  },
  value: {
    fontSize: theme.typography.body2.fontSize,
  },
  valueSecondary: {
    lineHeight: 1,
    fontSize: theme.typography.body2.fontSize,
  },
}))(({ classes, title, titleSecondary, value, valueSecondary }) => (
  <ListItem key={title} className={classes.listItem} dense disableGutters>
    <div>
      <ListItemText classes={{ primary: classes.title }} primary={title} />
      {titleSecondary && (
        <ListItemText
          secondary={titleSecondary}
          classes={{ secondary: classes.titleSecondary }}
        />
      )}
    </div>
    <div style={{ textAlign: 'right' }}>
      <ListItemText primary={value} classes={{ primary: classes.value }} />
      {valueSecondary && (
        <ListItemText
          secondary={valueSecondary}
          classes={{
            secondary: clsx(classes.valueSecondary),
          }}
        />
      )}
    </div>
  </ListItem>
))

export default StyledListItem
