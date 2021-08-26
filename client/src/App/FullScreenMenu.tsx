import React from 'react'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import Slide, { SlideProps } from '@material-ui/core/Slide'

import { Icon, Link, Button } from '../Components'
import Search from './Search'

type SearchState = {
  inputValue: string
  options: any[]
}

enum SearchActionKind {
  UPDATE_INPUT = 'UPDATE_INPUT',
  UPDATE_OPTIONS = 'UPDATE_OPTIONS',
  CLEAR = 'CLEAR',
}

interface SearchAction {
  type: SearchActionKind
  payload: any
}

type DialogProps = {
  open: boolean
  onClose: () => void
  searchState: SearchState
  dispatch: React.Dispatch<SearchAction>
  classes: any
}

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction='left' ref={ref} {...props} />
})

const FullScreenMenu = ({
  open,
  onClose,
  searchState,
  dispatch,
  classes,
}: DialogProps) => {
  return (
    <Dialog
      fullScreen
      disablePortal
      open={open}
      TransitionComponent={Transition}
      closeAfterTransition
      hideBackdrop
      PaperProps={{
        className: classes.DialogPaper,
      }}
    >
      <AppBar
        position='static'
        color='transparent'
        elevation={0}
        className={classes.AppBar}
      >
        <Toolbar component='nav' variant='dense' className={classes.Toolbar}>
          <Container disableGutters maxWidth='sm' className={classes.wrapper}>
            <Link className={classes.Logo} to='/'>
              <Icon name='logo' title='App Logo Icon' />
            </Link>
            <Button
              className={`${classes.menuButton} ${classes.closeMenuButton}`}
              onClick={onClose}
            >
              <Icon name='close' title='Close Menu Icon' height={26} />
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant='h1' color='inherit' paragraph>
          Search
        </Typography>
        <Search searchState={searchState} dispatch={dispatch} mobile />
        <Box py={2}>
          <Typography variant='h3' color='inherit' gutterBottom>
            <Link underline='hover' to='/'>
              News
            </Link>
          </Typography>
          <Typography variant='h3' color='inherit' gutterBottom>
            <Link underline='hover' to='/'>
              Market
            </Link>
          </Typography>
        </Box>
      </Container>
    </Dialog>
  )
}

export default FullScreenMenu
