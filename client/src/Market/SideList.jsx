import React from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles(theme => ({
  subheader: {
    fontSize: theme.typography.h6.fontSize,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  listItem: {
    // marginBottom: 2,
    '& > div:last-child': {
      marginLeft: 'auto',
    },
  },
  avatar: {
    height: 'auto',
    width: 'auto',
    marginRight: theme.spacing(2),
  },
  avatarImg: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  title: {
    fontSize: theme.typography.body2.fontSize,
    // fontFamily: theme.typography.fontFamily,
    fontWeight: 600,
  },
  titleSecondary: {
    lineHeight: 1,
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
  },
  value: {
    fontSize: theme.typography.body2.fontSize,
    // fontWeight: 600,
  },
  valueSecondary: {
    lineHeight: 1,
    fontSize: theme.typography.body2.fontSize,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
}))

const AssetIcon = ({ alt, src, classes }) => {
  return (
    <Avatar
      alt={alt}
      src={src}
      classes={{
        root: classes.avatar,
        img: classes.avatarImg,
      }}
    />
  )
}

const MyListItem = ({
  classes,
  alt,
  Icon,
  title,
  titleSecondary,
  value,
  valueSecondary,
  performanceColor,
}) => {
  return (
    <ListItem key={title} className={classes.listItem} dense disableGutters>
      {/* {Icon && <AssetIcon alt={alt} src={Icon} classes={classes} />} */}
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
              secondary: clsx(
                classes.valueSecondary,
                performanceColor &&
                  (performanceColor === 'green' ? classes.green : classes.red),
              ),
            }}
          />
        )}
      </div>
    </ListItem>
  )
}

const MyList = ({ ariaLabel, subheader, list }) => {
  const classes = useStyles()
  return (
    <List
      className={classes.list}
      aria-labelledby={ariaLabel}
      dense
      subheader={
        <ListSubheader className={classes.subheader} id={ariaLabel} disableGutters>
          {subheader}
        </ListSubheader>
      }
    >
      {list.map(item => (
        <MyListItem classes={classes} {...item} />
      ))}
    </List>
  )
}

export default MyList
