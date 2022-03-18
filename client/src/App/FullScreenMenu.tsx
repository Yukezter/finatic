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

import { LogoIcon, CloseIcon } from '../Icons'
import { IconButton, RouterLink } from '../Components'
import Search from './Search'

const PREFIX = 'FullScreenMenu'

const classes = {
  root: `${PREFIX}-root`,
  AppBar: `${PREFIX}-AppBar`,
  Toolbar: `${PREFIX}-Toolbar`,
  Container: `${PREFIX}-Container`,
  Logo: `${PREFIX}-Logo`,
  Search: `${PREFIX}-Search`,
  closeMenuButton: `${PREFIX}-closeMenuButton`,
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.root}`]: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    '& .active': {
      color: theme.palette.primary.main,
    },
  },

  [`& .${classes.AppBar}`]: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
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
    marginRight: theme.spacing(3),
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },

  [`& .${classes.Search}`]: {
    background: theme.palette.common.white,
  },

  [`& .${classes.closeMenuButton}`]: {
    marginLeft: 'auto',
    color: theme.palette.common.black,
  },
}))

type DialogProps = {
  open: boolean
  handleClose: () => void
  searchState: SearchState
  dispatch: React.Dispatch<SearchAction>
}

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction='left' ref={ref} {...props} />
})

const FullScreenMenu = ({ open, handleClose, searchState, dispatch }: DialogProps) => {
  return (
    <StyledDialog
      fullScreen
      disablePortal
      open={open}
      TransitionComponent={Transition}
      closeAfterTransition
      hideBackdrop
      PaperProps={{
        className: classes.root,
      }}
    >
      <AppBar position='static' color='transparent' elevation={0} className={classes.AppBar}>
        <Toolbar component='nav' variant='dense' className={classes.Toolbar}>
          <Container disableGutters maxWidth='sm' className={classes.Container}>
            <RouterLink className={classes.Logo} to='/'>
              <LogoIcon title='Finatic' />
            </RouterLink>
            <IconButton
              onClick={handleClose}
              className={classes.closeMenuButton}
              size='small'
              sx={{
                ':hover': {
                  background: 'none',
                },
              }}
            >
              <CloseIcon title='Close Menu' height={25} width={25} />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>
      <Container>
        <Search className={classes.Search} searchState={searchState} dispatch={dispatch} />
        <Box py={3}>
          <Typography variant='h3' color='inherit' gutterBottom>
            <RouterLink activeClassName='active' to='/news'>
              News
            </RouterLink>
          </Typography>
          <Typography variant='h3' color='inherit' gutterBottom>
            <RouterLink activeClassName='active' to='/market'>
              Market
            </RouterLink>
          </Typography>
        </Box>
      </Container>
    </StyledDialog>
  )
}

export default FullScreenMenu
