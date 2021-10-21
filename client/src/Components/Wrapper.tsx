import { withStyles, createStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

export default withStyles(({ spacing, breakpoints }) =>
  createStyles({
    root: {
      // overflow: 'hidden',
      maxWidth: breakpoints.values.sm - spacing(12),
      [breakpoints.up('sm')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
      [breakpoints.up('sm')]: {
        maxWidth: breakpoints.values.sm + spacing(6),
      },
      [breakpoints.up(breakpoints.values.md)]: {
        maxWidth: breakpoints.values.sm + spacing(6),
      },
      [breakpoints.up('lg')]: {
        maxWidth: breakpoints.values.md,
      },
    },
  })
)(({ children, ...props }: any) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Container disableGutters {...props}>
    {children}
  </Container>
))
