import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import Slide, { SlideProps } from '@material-ui/core/Slide'

import { SearchState, SearchAction } from '../types'

import { Icon, Link, Button } from '../Components'
import Search from './Search'

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    Paper: {
      background: palette.common.white,
      color: palette.text.primary,
    },
    AppBar: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    Toolbar: {
      minHeight: 56,
      width: '100%',
      margin: '0 auto',
    },
    Container: {
      display: 'flex',
      alignItems: 'center',
    },
    Logo: {
      marginRight: spacing(3),
      color: palette.primary.main,
      '&:hover': {
        color: palette.primary.dark,
      },
    },
    Search: {
      background: palette.common.white,
    },
    closeMenuButton: {
      marginLeft: 'auto',
      color: palette.common.black,
    },
  })
)

type DialogProps = {
  open: boolean
  onClose: () => void
  searchState: SearchState
  dispatch: React.Dispatch<SearchAction>
}

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction='left' ref={ref} {...props} />
})

const FullScreenMenu = ({ open, onClose, searchState, dispatch }: DialogProps) => {
  const classes = useStyles()
  return (
    <Dialog
      fullScreen
      disablePortal
      open={open}
      TransitionComponent={Transition}
      closeAfterTransition
      hideBackdrop
      PaperProps={{
        className: classes.Paper,
      }}
    >
      <AppBar
        position='static'
        color='transparent'
        elevation={0}
        className={classes.AppBar}
      >
        <Toolbar component='nav' variant='dense' className={classes.Toolbar}>
          <Container disableGutters maxWidth='sm' className={classes.Container}>
            <Link className={classes.Logo} to='/'>
              <Icon name='logo' title='Finatic' />
            </Link>
            <Button className={classes.closeMenuButton} onClick={onClose}>
              <Icon name='close' title='Close Menu' height={26} />
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant='h1' color='inherit' paragraph>
          Search
        </Typography>
        <Search
          className={classes.Search}
          searchState={searchState}
          dispatch={dispatch}
        />
        <Box py={2}>
          <Typography variant='h3' color='inherit' gutterBottom>
            <Link underline='hover' to='/news'>
              News
            </Link>
          </Typography>
          <Typography variant='h3' color='inherit' gutterBottom>
            <Link underline='hover' to='/market'>
              Market
            </Link>
          </Typography>
        </Box>
      </Container>
    </Dialog>
  )
}

export default FullScreenMenu
