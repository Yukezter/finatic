import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import Box from '@material-ui/core/Box'

import { ReactComponent as LogoIcon } from '../../shared/icons/013-eye.svg'
import { ReactComponent as SearchIcon } from '../../shared/icons/loupe.svg'
import { ReactComponent as CloseIcon } from '../../shared/icons/close.svg'

import useUnderBreakpoint from '../../shared/hooks/useUnderBreakpoint'

import NavLink from '../../shared/components/NavLink'
import Button from '../../shared/components/Button'
import Icon from '../../shared/components/Icon'
import Autocomplete from './Autocomplete'

const transitionDuration = 200

const useStyles = makeStyles(({ palette, spacing, breakpoints, typography }) => ({
  root: {
    backgroundColor: palette.common.white,
  },
  logo: fromDialog => ({
    display: !fromDialog ? 'none' : 'initial',
    '& > svg': {
      display: 'block',
      height: spacing(5),
      width: spacing(5),
      marginRight: spacing(2),
    },
    [breakpoints.up('sm')]: {
      display: 'initial',
    },
    [breakpoints.up(breakpoints.values.xl + spacing(8))]: {
      position: 'absolute',
      left: spacing(6),
    },
  }),
  brandName: fromDialog => ({
    marginRight: fromDialog ? spacing(2) : 'auto',
    '& > h3': {
      fontWeight: 700,
    },
    [breakpoints.up('sm')]: {
      display: !fromDialog ? 'none' : 'initial',
    },
  }),
  autocomplete: fromDialog => ({
    display: !fromDialog ? 'none' : 'initial',
    [breakpoints.up('sm')]: {
      display: 'initial',
      paddingLeft: 0,
      marginLeft: 0,
    },
  }),
  link: {
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
    color: palette.text.primary,
    '& > span': {
      fontFamily: typography.fontFamily,
      fontWeight: 600,
    },
    '&.active': {
      borderBottom: `2px solid ${palette.primary.main}`,
    },
  },
  buttonOpen: {
    '& svg': {
      height: spacing(3),
      width: spacing(3),
      color: palette.text.primary,
    },
    [breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  dialog: {
    height: '100%',
    width: '100%',
  },
  buttonClose: {
    marginLeft: 'auto',
    '& svg': {
      height: spacing(3),
      width: spacing(3),
      color: palette.text.primary,
    },
  },
}))

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction='left' ref={ref} {...props} />
})

const SearchDialog = ({ theme, history }) => {
  const classes = useStyles(true)
  const location = useLocation()
  const smallScreen = useUnderBreakpoint(theme.breakpoints.values.sm)

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    if (!smallScreen && open) {
      handleClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smallScreen])

  React.useEffect(() => {
    handleClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const autocompleteRef = React.useRef(null)

  return (
    <>
      <Button className={classes.buttonOpen} onClick={handleOpen}>
        <Icon Icon={SearchIcon} />
      </Button>
      <Dialog
        disablePortal
        fullScreen
        open={open}
        onClose={handleClose}
        closeAfterTransition
        transitionDuration={transitionDuration}
        TransitionComponent={Transition}
        onEntered={() => autocompleteRef.current.focus()}
      >
        <div className={classes.dialog}>
          <AppBar color='transparent' elevation={0} position='relative'>
            <Toolbar>
              <div className={classes.logo}>
                <LogoIcon />
              </div>
              <div className={classes.brandName}>
                <Typography variant='h4' component='h3'>
                  FINATIC
                </Typography>
              </div>
              <Button
                className={classes.buttonClose}
                aria-label='Close search dialog'
                onClick={handleClose}
              >
                <Icon Icon={CloseIcon} />
              </Button>
            </Toolbar>
          </AppBar>
          <Container disableGutters={smallScreen}>
            <Box mt={2}>
              <Autocomplete
                ref={autocompleteRef}
                theme={theme}
                history={history}
                fromDialog={true}
              />
            </Box>
          </Container>
        </div>
      </Dialog>
    </>
  )
}

let count = 0

const Header = ({ theme }) => {
  console.log('Header', ++count)

  const classes = useStyles(false)
  const history = useHistory()

  const autocompleteRef = React.useRef(null)

  return (
    <AppBar color='inherit' elevation={0} position='fixed'>
      <Container maxWidth='lg'>
        <Toolbar disableGutters variant='regular' style={{ position: 'static' }}>
          <div className={classes.logo}>
            <LogoIcon />
          </div>
          <div className={classes.brandName}>
            <Typography variant='h4' component='h3'>
              FINATIC
            </Typography>
          </div>
          <Container className={classes.autocomplete}>
            <Autocomplete
              ref={autocompleteRef}
              theme={theme}
              history={history}
              fromDialog={false}
            />
          </Container>
          <NavLink to='/market' className={classes.link} activeClassName='active'>
            <Typography variant='h6' component='span'>
              Market
            </Typography>
          </NavLink>
          <NavLink to='/news' className={classes.link} activeClassName='active'>
            <Typography variant='h6' component='span'>
              News
            </Typography>
          </NavLink>
          <SearchDialog theme={theme} history={history} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
