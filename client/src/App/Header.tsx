/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import { ThemeProvider, StyledEngineProvider, Theme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import useMediaQuery from '@mui/material/useMediaQuery'

import { SearchState, SearchAction, SearchActionKind } from '../types'

import { light } from '../theme'
import { LogoIcon, MenuIcon, MarketsIllustrationIcon, NewsIllustrationIcon } from '../Icons'
import { Wrapper, RouterLink, IconButton } from '../Components'
import Search from './Search'
import FullScreenMenu from './FullScreenMenu'

const PREFIX = 'Header'

const classes = {
  AppBar: `${PREFIX}-AppBar`,
  Toolbar: `${PREFIX}-Toolbar`,
  Container: `${PREFIX}-Container`,
  Logo: `${PREFIX}-Logo`,
  Search: `${PREFIX}-Search`,
  pages: `${PREFIX}-pages`,
  openMenuButton: `${PREFIX}-openMenuButton`,
  illustrationContainer: `${PREFIX}-illustrationContainer`,
  illustration: `${PREFIX}-illustration`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.AppBar}`]: {
    // position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,

    '&.transition': {
      transition: 'none',
      transitionProperty: 'color, background-color, box-shadow',
      transitionDuration: `${theme.transitions.duration.standard}ms`,
    },

    '&.active': {
      backgroundColor: theme.palette.secondary.main,

      [`& .${classes.openMenuButton}`]: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
      },

      [`& .${classes.pages}`]: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
      },
    },
  },

  [`& .${classes.Toolbar}`]: {
    minHeight: 56,
    width: '100%',
    position: 'static',
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
    [theme.breakpoints.up(880)]: {
      position: 'absolute',
      left: theme.spacing(4),
    },
  },

  [`& .${classes.Search}`]: {
    width: theme.spacing(50),
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(40),
    },
  },

  [`& .${classes.pages}`]: {
    marginLeft: 'auto',
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.openMenuButton}`]: {
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  [`& .${classes.illustrationContainer}`]: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.secondary.main,
    [theme.breakpoints.up('sm')]: {
      height: 220,
    },
  },

  [`& .${classes.illustration}`]: {
    height: 180,
    width: 180,
    marginLeft: '25%',
    [theme.breakpoints.up('sm')]: {
      height: 220,
      width: 220,
    },
  },
}))

const initialState: SearchState = {
  inputValue: '',
  options: [],
}

const searchReducer: React.Reducer<SearchState, SearchAction> = (
  prevState: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case SearchActionKind.UPDATE_INPUT: {
      return {
        ...prevState,
        inputValue: action.payload,
        options: [],
      }
    }
    case SearchActionKind.UPDATE_OPTIONS: {
      return {
        ...prevState,
        options: action.payload,
      }
    }
    case SearchActionKind.CLEAR: {
      return {
        ...prevState,
        inputValue: '',
        options: [],
      }
    }
    default: {
      return prevState
    }
  }
}

export default () => {
  const [open, setOpen] = React.useState(false)
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const location = useLocation()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (open && matches) {
    handleClose()
  }

  React.useEffect(() => {
    handleClose()
    window.scrollTo(0, 0)
  }, [location.pathname])

  const headerRef = React.useRef<HTMLDivElement>(null)
  const [illustrationContainerEl, setIllustrationContainer] = React.useState<HTMLDivElement>()
  const illustrationContainerRefCallback: React.RefCallback<HTMLDivElement> =
    React.useCallback(node => {
      if (node) {
        setIllustrationContainer(node)
      }
    }, [])

  React.useEffect(() => {
    const headerEl = headerRef.current
    let observer: IntersectionObserver

    if (headerEl && illustrationContainerEl) {
      observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            headerEl!.classList.add('active')
          } else {
            headerEl!.classList.remove('active')
          }
        },
        {
          root: null,
          threshold: illustrationContainerEl
            ? headerEl!.getBoundingClientRect().height /
              illustrationContainerEl!.getBoundingClientRect().height
            : 0,
        }
      )

      if (illustrationContainerEl) {
        headerEl!.classList.add('transition')
        observer.observe(illustrationContainerEl)
      }
    }
    return () => {
      if (observer && illustrationContainerEl) {
        observer.unobserve(illustrationContainerEl)
        headerEl!.classList.remove('transition')
      }
    }
  }, [illustrationContainerEl])

  const [searchState, dispatch] = React.useReducer(searchReducer, initialState)

  useQuery(`/search/${searchState.inputValue}`, {
    enabled: !!searchState.inputValue.length,
    notifyOnChangeProps: [],
    onSuccess: data => {
      dispatch({
        type: SearchActionKind.UPDATE_OPTIONS,
        payload: data,
      })
    },
  })

  return (
    <Root>
      <AppBar
        ref={headerRef}
        component={Wrapper}
        color='default'
        elevation={0}
        classes={{
          root: classNames(
            classes.AppBar,
            ['/news', '/market'].includes(location.pathname) && 'active'
          ),
        }}
      >
        <Toolbar className={classes.Toolbar} component='nav' variant='dense' disableGutters>
          <RouterLink className={classes.Logo} to='/'>
            <LogoIcon title='Finatic' />
          </RouterLink>
          <Hidden smDown>
            <Search className={classes.Search} searchState={searchState} dispatch={dispatch} />
            <div className={classNames(classes.pages)}>
              <Typography variant='h6' color='inherit'>
                <RouterLink to='/news'>News</RouterLink>
              </Typography>
              <Typography variant='h6' color='inherit'>
                <RouterLink to='/market'>Market</RouterLink>
              </Typography>
            </div>
          </Hidden>
          <IconButton
            onClick={handleOpen}
            className={classes.openMenuButton}
            size='small'
            sx={{
              ':hover': {
                background: 'none',
              },
            }}
          >
            <MenuIcon title='Open Menu' height={30} width={30} />
          </IconButton>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={light}>
              <FullScreenMenu
                open={open}
                handleClose={handleClose}
                searchState={searchState}
                dispatch={dispatch}
              />
            </ThemeProvider>
          </StyledEngineProvider>
        </Toolbar>
      </AppBar>
      {['/news', '/market'].includes(location.pathname) && (
        <Container
          ref={illustrationContainerRefCallback}
          className={classes.illustrationContainer}
          maxWidth={false}
          disableGutters
        >
          {location.pathname === '/news' ? (
            <NewsIllustrationIcon className={classes.illustration} />
          ) : (
            <MarketsIllustrationIcon className={classes.illustration} />
          )}
        </Container>
      )}
    </Root>
  )
}
