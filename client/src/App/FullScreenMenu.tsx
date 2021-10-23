import React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import Slide, { SlideProps } from '@mui/material/Slide'

import { SearchState, SearchAction } from '../types'

import { Icon, Link, Button } from '../Components'
import Search from './Search'

const PREFIX = 'FullScreenMenu'

const classes = {
  Paper: `${PREFIX}-Paper`,
  AppBar: `${PREFIX}-AppBar`,
  Toolbar: `${PREFIX}-Toolbar`,
  Container: `${PREFIX}-Container`,
  Logo: `${PREFIX}-Logo`,
  Search: `${PREFIX}-Search`,
  closeMenuButton: `${PREFIX}-closeMenuButton`,
}

const StyledDialog = styled(Dialog)(({ theme: { palette, spacing } }) => ({
  [`& .${classes.Paper}`]: {
    background: palette.common.white,
    color: palette.text.primary,
  },

  [`& .${classes.AppBar}`]: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  [`& .${classes.Toolbar}`]: {
    minHeight: 56,
    width: '100%',
    margin: '0 auto',
  },

  [`& .${classes.Container}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.Logo}`]: {
    marginRight: spacing(3),
    color: palette.primary.main,
    '&:hover': {
      color: palette.primary.dark,
    },
  },

  [`& .${classes.Search}`]: {
    background: palette.common.white,
  },

  [`& .${classes.closeMenuButton}`]: {
    marginLeft: 'auto',
    color: palette.common.black,
  },
}))

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
  return (
    <StyledDialog
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
    </StyledDialog>
  )
}

export default FullScreenMenu
