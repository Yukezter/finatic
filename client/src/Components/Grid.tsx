/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles, createStyles, GridProps } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'

const useStyles = makeStyles(theme =>
  createStyles({
    root: ({ size }: { size: Breakpoint | number }) => ({
      [theme.breakpoints.down(
        typeof size === 'string' ? theme.breakpoints.values[size] : size
      )]: {
        width: 'initial',
        margin: 0,
        '& > .MuiGrid-item': {
          padding: 0,
        },
      },
    }),
  })
)

interface Props extends GridProps {
  size?: Breakpoint | number
}

export default ({ children, classes: propClasses = {}, size = 0, ...props }: Props) => {
  const classes = useStyles({ size })

  return (
    <Grid
      classes={{ root: classNames(classes.root, propClasses.root), ...propClasses }}
      {...props}
    >
      {children}
    </Grid>
  )
}
