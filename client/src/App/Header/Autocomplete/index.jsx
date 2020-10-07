import React from 'react'
import _ from 'lodash'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { useAutocomplete, createFilterOptions } from '@material-ui/lab'

import { ReactComponent as SearchIcon } from '../../../shared/assets/icons/magnifying-glass.svg'
import { ReactComponent as CloseIcon } from '../../../shared/assets/icons/cancel.svg'
import Icon from '../../../shared/components/Icon'

import useLogRenders from '../../../shared/hooks/useLogRenders'
import useMergeState from '../../../shared/hooks/useMergeState'
import api from '../../../shared/utils/api'

import useStyles from './styles'

const Autocomplete = React.forwardRef(
  ({ history, closeModal }, autocompleteRef) => {
    const classes = useStyles()

    const [state, mergeState] = useMergeState({
      loading: false,
      options: [],
      inputValue: '',
    })

    useLogRenders(state)

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
      []
    )

    React.useEffect(() => {
      let active = true

      const inputValue = state.inputValue.trim()
      if (!inputValue) return

      fetch(inputValue, options => {
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
        onKeyDown: event => {
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
        <Container className='search-content' maxWidth={false} disableGutters>
          <Container maxWidth={false} disableGutters>
            <TextField
              {...RootProps()}
              fullWidth
              size='small'
              hiddenLabel
              aria-label='search'
              placeholder='Search finatic.com'
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
                    <Box p={1.5}>
                      <Icon icon={SearchIcon} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            {popupOpen && (
              <Paper className={classes.paper} square elevation={0}>
                {state.loading ? (
                  <div className={classes.loading}>
                    <Typography variant='body1' component='span'>
                      Loading...
                    </Typography>
                  </div>
                ) : !groupedOptions.length ? (
                  <div className={classes.loading}>
                    <Typography variant='body1' component='span'>
                      No options
                    </Typography>
                  </div>
                ) : (
                  <ul className={classes.listbox} {...getListboxProps()}>
                    {groupedOptions.map((option, index) => (
                      <li {...getOptionProps({ option, index })}>
                        <div>
                          <Typography variant='body1' component='h6'>
                            {option.symbol}
                          </Typography>
                          <Typography variant='caption' component='span'>
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
        <IconButton
          className='close-modal-button'
          aria-label='Close'
          onClick={closeModal}
          color='inherit'
        >
          <Icon icon={CloseIcon} />
        </IconButton>
      </div>
    )
  }
)

export default Autocomplete
