import { makeStyles } from '@material-ui/core'

import { ReactComponent as LogoIcon } from '../icons/013-eye.svg'

const useStyles = makeStyles(({ spacing, palette, zIndex }) => ({
  // Animations
  '@keyframes spin': {
    '0%': {
      transform: 'rotateZ(0)',
    },
    '25%': {
      transform: 'rotateZ(90deg)',
    },
    '75%': {
      transform: 'rotateZ(180deg)',
    },
    '100%': {
      transform: 'rotateZ(270deg)',
    },
  },
  // Styles
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background.default,
    zIndex: zIndex.modal,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoIcon: {
    height: spacing(8),
    width: spacing(8),
    display: 'block',
    animation: '$spin 2s step-start infinite',
  },
  text: {
    fontWeight: 700,
  },
}))

const Loading = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <LogoIcon className={classes.logoIcon} />
      </div>
    </div>
  )
}

export default Loading
