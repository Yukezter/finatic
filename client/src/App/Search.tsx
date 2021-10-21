/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
// import { alpha } from '@material-ui/core/styles'
// import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
  useAutocomplete,
  createFilterOptions,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from '@material-ui/lab'

import { SearchState, SearchActionKind } from '../types'

import { Icon, Link, Input } from '../Components'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 36,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  static: {
    position: 'static',
  },
  absolute: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'inherit',
    borderRadius: 'inherit',
    borderColor: 'transparent',
  },
  inputRoot: {
    color: theme.palette.text.hint,
  },
  focused: {
    // color: 'inherit',
    color: theme.palette.text.primary,
  },
  li: {
    '&[data-focus="true"]': {
      background: theme.palette.action.focus,
    },
    '& > a': {
      display: 'flex',
      width: '100%',
    },
  },
}))

type Props = {
  searchState: SearchState
  dispatch: React.Dispatch<any>
  className?: string
}

const Search: React.FC<Props> = ({ searchState, dispatch, className }: Props) => {
  const classes = useStyles()
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
      history.push(`/company/${newValue.symbol}`)

      dispatch({ type: SearchActionKind.CLEAR })
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
    <div className={classNames(className, classes.root)} {...getRootProps()}>
      <div className={classes.absolute}>
        <Input
          placeholder='Stonks...'
          startAdornment={
            <InputAdornment position='start' disablePointerEvents>
              <Icon name='search' title='Search Icon' height={18} />
            </InputAdornment>
          }
          classes={{
            root: classNames(classes.inputRoot, classes.static),
            focused: classes.focused,
          }}
          inputProps={{
            ...getInputProps(),
          }}
        />
        {popupOpen && groupedOptions.length ? (
          <MenuList dense {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <MenuItem
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
              </MenuItem>
            ))}
          </MenuList>
        ) : null}
      </div>
    </div>
  )
}

export default Search
