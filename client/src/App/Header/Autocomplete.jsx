import React from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
// import Box from '@material-ui/core/Box'
import { useAutocomplete, createFilterOptions } from '@material-ui/lab'

import { ReactComponent as CloseIcon } from '../../shared/icons/close.svg'
import { ReactComponent as SearchIcon } from '../../shared/icons/loupe.svg'

import Button from '../../shared/components/Button'

// import useLogRenders from '../../shared/hooks/useLogRenders'
import useMergeState from '../../shared/hooks/useMergeState'
import api from '../../shared/utils/api'

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    width: '100%',
    maxWidth: 680,
    position: 'relative',
    display: 'flex',
    margin: '0 auto',
    alignSelf: 'flex-start',
  },
  searchIcon: {
    padding: spacing(1.5),
    '& svg': {
      display: 'block',
      height: spacing(3),
      width: spacing(3),
    },
  },
  closeButton: {
    padding: spacing(1.5),
    '& svg': {
      display: 'block',
      height: spacing(3),
      width: spacing(3),
    },
  },
  Input: {
    height: 48,
  },
  underline: {
    '&&&::before, :hover::before, &&&::after': {
      borderBottom: 'none',
    },
  },
  paper: {
    width: '100%',
    position: 'absolute',
    top: 48,
    overflow: 'hidden',
    zIndex: 1,
    border: `1px solid ${palette.divider}`,
  },
  listbox: {
    width: '100%',
    listStyle: 'none',
    overflow: 'auto',
    maxHeight: 280,
    margin: 0,
    padding: `${spacing(1)}px 0`,
    boxSizing: 'border-box',
    '& > li': {
      display: 'flex',
      outline: 0,
      minHeight: 48,
      cursor: 'pointer',
      alignItems: 'center',
      paddingTop: 6,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 6,
    },
    '& > li[data-focus="true"]': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '& > li:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  loading: {
    color: 'rgba(8, 7, 8, 0.5)',
    padding: '14px 16px',
  },
}))

const Autocomplete = React.forwardRef(({ history, closeModal }, autocompleteRef) => {
  const classes = useStyles()

  const [state, mergeState] = useMergeState({
    loading: false,
    options: [],
    inputValue: '',
  })

  // useLogRenders(state)

  const fetch = React.useCallback(
    _.debounce(async (inputValue, callback) => {
      const response = await api.get(`/search/${inputValue}`).catch(() => {
        mergeState({
          loading: false,
          options: [],
        })
      })

      callback(response.data)
    }, 1000),
    [],
  )

  React.useEffect(() => {
    let active = true

    const inputValue = state.inputValue.trim()
    if (!inputValue) return

    fetch(inputValue, (options) => {
      if (active) {
        mergeState({
          loading: false,
          options: options,
        })
      }
    })

    return () => {
      active = false
    }
  }, [state.inputValue, fetch, mergeState])

  const onChange = (_event, newValue, reason) => {
    if (reason === 'select-option' && newValue) {
      history.push(`/company/${newValue.symbol}`)

      closeModal()
    }
  }

  const onInputChange = (_event, inputValue, reason) => {
    if (reason === 'input') {
      mergeState({
        loading: !!inputValue.trim(),
        options: [],
        inputValue,
      })
    }
  }

  const filterOptions = createFilterOptions({
    limit: 10,
    trim: true,
    stringify: ({ symbol, securityName }) => {
      return symbol + ' ' + securityName
    },
  })

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    popupOpen,
  } = useAutocomplete({
    id: 'search-autocomplete',
    value: null,
    onChange,
    inputValue: state.inputValue,
    onInputChange,
    options: state.options,
    open: !!state.inputValue.length,
    getOptionLabel: ({ securityName }) => securityName,
    filterOptions,
    clearOnBlur: false,
    openOnFocus: false,
    selectOnFocus: false,
  })

  // Override 'Escape' key so that it closes modal instead
  const RootProps = () => {
    const { onKeyDown, ...restRootProps } = getRootProps()

    return {
      ...restRootProps,
      onKeyDown: (event) => {
        if (event.key === 'Escape') {
          closeModal()
        } else {
          onKeyDown(event)
        }
      },
    }
  }

  return (
    <div className={classes.root}>
      <Container className="search-content" maxWidth={false} disableGutters>
        <Container maxWidth={false} disableGutters>
          <TextField
            {...RootProps()}
            fullWidth
            size="small"
            hiddenLabel
            aria-label="search"
            placeholder="Search finatic.com"
            InputLabelProps={{
              ...getInputLabelProps(),
            }}
            InputProps={{
              ...getInputProps(),
              inputRef: autocompleteRef,
              classes: {
                root: classes.Input,
                underline: classes.underline,
              },
              startAdornment: (
                <InputAdornment>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                </InputAdornment>
              ),
            }}
          />
          {popupOpen && (
            <Paper className={classes.paper} square elevation={0}>
              {state.loading ? (
                <div className={classes.loading}>
                  <Typography variant="body1" component="span">
                    Loading...
                  </Typography>
                </div>
              ) : !groupedOptions.length ? (
                <div className={classes.loading}>
                  <Typography variant="body1" component="span">
                    No options
                  </Typography>
                </div>
              ) : (
                <ul className={classes.listbox} {...getListboxProps()}>
                  {groupedOptions.map((option, index) => (
                    <li {...getOptionProps({ option, index })}>
                      <div>
                        <Typography variant="body1" component="h6">
                          {option.symbol}
                        </Typography>
                        <Typography variant="caption" component="span">
                          {option.securityName}
                        </Typography>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Paper>
          )}
        </Container>
      </Container>
      <Button
        className={classes.closeButton + ' close-modal-button'}
        aria-label="Close"
        onClick={closeModal}
      >
        <CloseIcon />
      </Button>
    </div>
  )
})

export default Autocomplete
