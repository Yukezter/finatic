import React from 'react'
import { withStyles } from '@material-ui/core'
import clsx from 'clsx'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Skeleton from '@material-ui/lab/Skeleton'

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
}))(({ classes, isLoading, title, titleSecondary, value, valueSecondary }) => (
  <ListItem key={title} className={classes.listItem} dense disableGutters>
    <div>
      <ListItemText
        classes={{ primary: classes.title }}
        primary={isLoading ? <Skeleton width={50} /> : title}
      />
      {titleSecondary && (
        <ListItemText
          secondary={isLoading ? <Skeleton width={60} /> : titleSecondary}
          classes={{ secondary: classes.titleSecondary }}
        />
      )}
    </div>
    <div style={{ textAlign: 'right' }}>
      <ListItemText
        classes={{ primary: classes.value }}
        primary={
          isLoading ? <Skeleton width={50} style={{ marginLeft: 'auto' }} /> : value
        }
      />
      {valueSecondary && (
        <ListItemText
          secondary={
            isLoading ? (
              <Skeleton width={80} style={{ marginLeft: 'auto' }} />
            ) : (
              valueSecondary
            )
          }
          classes={{
            secondary: clsx(classes.valueSecondary),
          }}
        />
      )}
    </div>
  </ListItem>
))

export default StyledListItem
