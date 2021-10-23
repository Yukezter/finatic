/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import {
  // debounce,
  ThemeProvider,
  StyledEngineProvider,
  Theme,
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import { SearchState, SearchAction, SearchActionKind } from '../types'

import { light } from '../theme'
import { Wrapper, Icon, Link, IconButton } from '../Components'
import Search from './Search'
import FullScreenMenu from './FullScreenMenu'

const illustrationContainerHeight = 240

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
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.AppBar}`]: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    transition: 'none',
    transitionProperty: 'color, background-color, box-shadow',
    transitionDuration: `${theme.transitions.duration.standard}ms`,
    '&.trigger': {
      [theme.breakpoints.up('lg')]: {
        backgroundColor: theme.palette.secondary.main,
        // boxShadow: 'none',
      },
    },
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
    [theme.breakpoints.up(880)]: {
      position: 'absolute',
      left: theme.spacing(4),
    },
  },

  [`& .${classes.Search}`]: {
    width: theme.spacing(50),
    [theme.breakpoints.down(Number(theme.breakpoints.values.sm + theme.spacing(8)))]: {
      width: theme.spacing(40),
    },
  },

  [`& .${classes.pages}`]: {
    marginLeft: 'auto',
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
    '&.trigger': {
      [theme.breakpoints.up('lg')]: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
      },
    },
  },

  [`& .${classes.openMenuButton}`]: {
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  [`& .${classes.illustrationContainer}`]: {
    height: illustrationContainerHeight,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.secondary.main,
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

const newsIllustration = (
  <Icon name='news_illustration' width={220} height={220} style={{ marginLeft: '30%' }} />
)

const marketsIllustration = (
  <Icon
    name='markets_illustration'
    width={220}
    height={220}
    style={{ marginLeft: '30%' }}
  />
)

const IllustrationContainer = ({ illustration }: { illustration: JSX.Element }) => (
  <Hidden lgDown>
    <Container className={classes.illustrationContainer} maxWidth={false} disableGutters>
      {illustration}
    </Container>
  </Hidden>
)

const ScrollTrigger = ({ children }: { children: JSX.Element }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: illustrationContainerHeight,
  })

  return React.cloneElement(children, {
    trigger: !trigger,
  })
}

const HeaderView = ({
  open,
  handleOpen,
  handleClose,
  searchState,
  dispatch,
  trigger,
}: any) => (
  <AppBar
    color='default'
    elevation={0}
    classes={{ root: classNames(classes.AppBar, trigger && 'trigger') }}
  >
    <Toolbar component='nav' variant='dense' className={classes.Toolbar}>
      <Wrapper className={classes.Container}>
        <Link className={classes.Logo} to='/'>
          <Icon name='logo' title='Finatic' />
        </Link>
        <Hidden smDown>
          <Search
            className={classes.Search}
            searchState={searchState}
            dispatch={dispatch}
          />
          <div className={classNames(classes.pages, trigger && 'trigger')}>
            <Typography variant='h6' color='inherit'>
              <Link underline='hover' to='/news'>
                News
              </Link>
            </Typography>
            <Typography variant='h6' color='inherit'>
              <Link underline='hover' to='/market'>
                Market
              </Link>
            </Typography>
          </div>
        </Hidden>
        <IconButton onClick={handleOpen} className={classes.openMenuButton} size='small'>
          <Icon name='menu' title='Open Menu' height={30} />
        </IconButton>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={light}>
            <FullScreenMenu
              open={open}
              onClose={handleClose}
              searchState={searchState}
              dispatch={dispatch}
            />
          </ThemeProvider>
        </StyledEngineProvider>
      </Wrapper>
    </Toolbar>
  </AppBar>
)

const Header = (props: any) => (
  <Switch>
    <Route
      path={['/news', '/market']}
      exact
      render={(routeProps: RouteComponentProps) => (
        <>
          <ScrollTrigger>
            <HeaderView {...routeProps} {...props} />
          </ScrollTrigger>
          <IllustrationContainer
            illustration={
              routeProps.match.path === '/news' ? newsIllustration : marketsIllustration
            }
          />
        </>
      )}
    />
    <Route
      path='/'
      render={(routeProps: RouteComponentProps) => (
        <HeaderView {...routeProps} {...props} />
      )}
    />
  </Switch>
)

export default () => {
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (open && matches) {
    handleClose()
  }

  const [searchState, dispatch] = React.useReducer(searchReducer, initialState)

  useQuery(`/search/${searchState.inputValue}`, {
    enabled: !!searchState.inputValue.length,
    notifyOnChangeProps: [],
    onSuccess: ({ data }) => {
      dispatch({
        type: SearchActionKind.UPDATE_OPTIONS,
        payload: data,
      })
    },
  })

  return (
    <Root>
      <Header
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        searchState={searchState}
        dispatch={dispatch}
      />
    </Root>
  )
}
