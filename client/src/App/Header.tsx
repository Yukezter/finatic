import React from 'react'
import { useQuery } from 'react-query'
import { makeStyles, useTheme } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { Icon, Link, Button } from '../Components'
import Search from './Search'
import FullScreenMenu from './FullScreenMenu'

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

const useStyles = makeStyles(theme => {
  const { breakpoints, spacing, palette } = theme

  return {
    AppBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing(2),
    },
    Toolbar: {
      minHeight: 56,
      width: '100%',
      margin: '0 auto',
    },
    wrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    Logo: {
      marginRight: spacing(3),
      color: palette.primary.main,
      [breakpoints.up(1120)]: {
        position: 'absolute',
        left: spacing(4),
      },
      '&:hover': {
        color: palette.primary.dark,
      },
    },
    pages: {
      marginLeft: 'auto',
      display: 'none',
      [breakpoints.up('sm')]: {
        display: 'flex',
      },
      '& > *': {
        marginLeft: spacing(1),
      },
    },
    menuButton: {
      marginLeft: 'auto',
    },
    openMenuButton: {
      [breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    closeMenuButton: {
      color: palette.common.black,
    },
    DialogPaper: {
      color: palette.getContrastText(palette.common.white),
    },
  }
})

const Header = () => {
  const classes = useStyles()
  const { breakpoints } = useTheme()
  const matches = useMediaQuery(breakpoints.up('sm'))

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
      dispatch({ type: SearchActionKind.UPDATE_OPTIONS, payload: data })
    },
  })

  return (
    <AppBar color='secondary' className={classes.AppBar}>
      <Toolbar component='nav' variant='dense' className={classes.Toolbar}>
        <Container disableGutters maxWidth='md' className={classes.wrapper}>
          <Link className={classes.Logo} to='/'>
            <Icon name='logo' title='App Logo Icon' />
          </Link>
          <Search searchState={searchState} dispatch={dispatch} />
          <div className={classes.pages}>
            <Typography variant='h6' color='textPrimary'>
              <Link underline='hover' to='/'>
                News
              </Link>
            </Typography>
            <Typography variant='h6' color='textPrimary'>
              <Link underline='hover' to='/'>
                Market
              </Link>
            </Typography>
          </div>
          <Button
            onClick={handleOpen}
            className={`${classes.menuButton} ${classes.openMenuButton}`}
          >
            <Icon name='menu' title='Open Menu Icon' height={30} />
          </Button>
          <FullScreenMenu
            open={open}
            onClose={handleClose}
            searchState={searchState}
            dispatch={dispatch}
            classes={classes}
          />
        </Container>
      </Toolbar>
    </AppBar>
  )
}

export default Header
