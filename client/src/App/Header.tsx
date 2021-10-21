/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import {
  MuiThemeProvider,
  makeStyles,
  createStyles,
  // debounce,
  Theme,
} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'

import { SearchState, SearchAction, SearchActionKind } from '../types'

import { light } from '../theme'
import { Wrapper, Icon, Link, IconButton } from '../Components'
import Search from './Search'
import FullScreenMenu from './FullScreenMenu'

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

const illustrationContainerHeight = 240

const useStyles = makeStyles(theme =>
  createStyles({
    AppBar: {
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
      marginRight: theme.spacing(3),
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.dark,
      },
      [theme.breakpoints.up(theme.breakpoints.values.sm + theme.spacing(30))]: {
        position: 'absolute',
        left: theme.spacing(4),
      },
    },
    Search: {
      width: theme.spacing(50),
      [theme.breakpoints.down(theme.breakpoints.values.sm + theme.spacing(8))]: {
        width: theme.spacing(40),
      },
    },
    pages: {
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
    openMenuButton: {
      marginLeft: 'auto',
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    illustrationContainer: {
      height: illustrationContainerHeight,
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.secondary.main,
    },
  })
)

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

const IllustrationContainer = ({
  classes,
  illustration,
}: {
  classes: any
  illustration: JSX.Element
}) => (
  <Hidden mdDown>
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
  classes,
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
        <Hidden xsDown>
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
        <IconButton onClick={handleOpen} className={classes.openMenuButton}>
          <Icon name='menu' title='Open Menu' height={30} />
        </IconButton>
        <MuiThemeProvider theme={light}>
          <FullScreenMenu
            open={open}
            onClose={handleClose}
            searchState={searchState}
            dispatch={dispatch}
          />
        </MuiThemeProvider>
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
            classes={props.classes}
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
  const classes = useStyles()
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
    <Header
      classes={classes}
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      searchState={searchState}
      dispatch={dispatch}
    />
  )
}
