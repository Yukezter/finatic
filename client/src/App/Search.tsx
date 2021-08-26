/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import {
  useAutocomplete,
  createFilterOptions,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from '@material-ui/lab'

import { Icon, Link } from '../Components'
// import { useAutocomplete } from '../Hooks'

type SearchState = {
  inputValue: string
  options: any[]
}

type Props = {
  mobile?: boolean
  searchState: SearchState
  dispatch: React.Dispatch<any>
}

enum SearchActionKind {
  UPDATE_INPUT = 'UPDATE_INPUT',
  UPDATE_OPTIONS = 'UPDATE_OPTIONS',
  CLEAR = 'CLEAR',
}

const useStyles = makeStyles(theme => {
  const { palette, shape, spacing, breakpoints } = theme
  const { common, text, action, grey, secondary, getContrastText } = palette

  return {
    root: mobile => ({
      width: mobile ? '100%' : spacing(46),
      display: mobile ? 'block' : 'none',
      position: 'relative',
      [breakpoints.up('sm')]: {
        display: 'block',
      },
      [breakpoints.between('sm', breakpoints.values.sm + 200)]: {
        width: spacing(40),
      },
    }),
    inputRoot: mobile => ({
      height: 36,
      paddingLeft: spacing(1),
      color: mobile ? alpha(getContrastText(common.white), 0.5) : text.hint,

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: `1px solid ${alpha(grey[600], action.disabledOpacity)}`,
        borderRadius: shape.borderRadius,
      },
    }),
    input: mobile => ({
      paddingTop: 9,
      marginLeft: spacing(5),

      '&::placeholder': {
        color: mobile ? alpha(getContrastText(common.white), 0.5) : text.hint,
      },
    }),
    focused: mobile => ({
      color: mobile ? getContrastText(common.white) : text.primary,
    }),
    open: mobile => ({
      '&::before': {
        border: `1px solid ${
          mobile ? alpha(common.black, action.focusOpacity) : action.focus
        }`,
        borderBottom: 'none',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    }),
    startAdornment: {
      position: 'absolute',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    listbox: mobile => ({
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: 'auto',
      background: mobile ? common.white : secondary.main,
      color: mobile ? getContrastText(common.white) : text.primary,
      border: `1px solid ${
        mobile ? alpha(common.black, action.selectedOpacity) : action.selected
      }`,
      borderRadius: shape.borderRadius,

      borderTop: 'none',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    }),
    li: mobile => ({
      paddingTop: 0,
      paddingBottom: 0,
      '&:hover': {
        background: mobile ? alpha(common.black, action.hoverOpacity) : action.hover,
      },
      '&[data-focus="true"]': {
        background: mobile ? alpha(common.black, action.focusOpacity) : action.focus,
      },
      '&:active': {
        background: mobile
          ? alpha(common.black, action.selectedOpacity)
          : palette.action.selected,
      },
      '& > a': {
        display: 'flex',
        width: '100%',
        paddingTop: spacing(0.25),
        paddingBottom: spacing(0.25),
      },
    }),
  }
})

const Search: React.FC<Props> = ({ searchState, dispatch, mobile = false }: Props) => {
  const classes = useStyles(mobile)
  const history = useHistory()

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: ({ symbol, securityName }: any) => {
      return `${symbol} ${securityName}`
    },
  })

  const onInputChange: any = (
    _event: React.ChangeEvent<{}>,
    inputValue: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason === 'input') {
      dispatch({
        type: SearchActionKind.UPDATE_INPUT,
        payload: inputValue.trim(),
      })
    }
  }

  const onChange = (
    _event: React.ChangeEvent<{}>,
    newValue: any,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === 'select-option' && newValue) {
      dispatch({ type: SearchActionKind.CLEAR })

      history.push(`/company/${newValue.symbol}`)
    }
  }

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    popupOpen,
    groupedOptions,
  } = useAutocomplete({
    id: 'search-autocomplete',
    options: searchState.options,
    getOptionLabel: ({ securityName }: any) => securityName,
    filterOptions,
    inputValue: searchState.inputValue,
    value: null,
    onInputChange,
    onChange,
    openOnFocus: true,
  })

  return (
    <div className={classes.root} {...getRootProps()}>
      <InputBase
        fullWidth
        placeholder='Stonks...'
        startAdornment={
          <div className={classes.startAdornment}>
            <Icon name='search' title='Search Icon' height={22} />
          </div>
        }
        classes={{
          root: classes.inputRoot,
          input: classes.input,
          focused:
            popupOpen && groupedOptions.length
              ? `${classes.focused} ${classes.open}`
              : classes.focused,
        }}
        inputProps={{
          ...getInputProps(),
        }}
      />
      {popupOpen && groupedOptions.length ? (
        <div className={classes.listbox}>
          <List dense {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <ListItem
                key={option.symbol}
                className={classes.li}
                {...getOptionProps({ option, index })}
              >
                <Link to='/'>
                  <Typography
                    noWrap
                    style={{ width: 80, marginRight: 8, overflow: 'hidden' }}
                  >
                    {option.symbol}
                  </Typography>
                  <Typography noWrap style={{ width: '100%', overflow: 'hidden' }}>
                    {option.securityName}
                  </Typography>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      ) : null}
    </div>
  )
}

export default Search
