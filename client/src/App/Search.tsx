/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames'
import { styled } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import useAutocomplete, {
  createFilterOptions,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from '@mui/material/useAutocomplete'

import { SearchState, SearchActionKind } from '../types'

import { SearchIcon } from '../Icons'
import { RouterLink, Input } from '../Components'

const PREFIX = 'Search'

const classes = {
  root: `${PREFIX}-root`,
  static: `${PREFIX}-static`,
  absolute: `${PREFIX}-absolute`,
  inputRoot: `${PREFIX}-inputRoot`,
  focused: `${PREFIX}-focused`,
  li: `${PREFIX}-li`,
}

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  height: 36,
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,

  [`& .${classes.static}`]: {
    position: 'static',
  },

  [`& .${classes.absolute}`]: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'inherit',
    borderRadius: 'inherit',
    borderColor: 'transparent',
  },

  [`& .${classes.inputRoot}`]: {
    color: theme.palette.text.disabled,
  },

  [`& .${classes.focused}`]: {
    // color: 'inherit',
    color: theme.palette.text.primary,
  },

  [`& .${classes.li}`]: {
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
  const history = useHistory()

  // const refSymbolsArray = React.useMemo(() => {
  //   if (refSymbolsMap) {
  //     return Array.from(refSymbolsMap, ([symbol, data]) => ({
  //       symbol,
  //       ...data,
  //     }))
  //   }

  //   return []
  // }, [refSymbolsMap])

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
    if (reason === 'selectOption' && newValue) {
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
    <Root className={className} {...getRootProps()}>
      <div className={classes.absolute}>
        <Input
          placeholder='Stonks...'
          startAdornment={
            <InputAdornment position='start' disablePointerEvents>
              <SearchIcon title='Search icon' height={18} />
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
                className={classes.li}
                {...getOptionProps({ option, index })}
                key={option.symbol}
              >
                <RouterLink to='/' underline='none'>
                  <Typography noWrap style={{ width: 80, marginRight: 8, overflow: 'hidden' }}>
                    {option.symbol}
                  </Typography>
                  <Typography noWrap style={{ width: '100%', overflow: 'hidden' }}>
                    {option.securityName}
                  </Typography>
                </RouterLink>
              </MenuItem>
            ))}
          </MenuList>
        ) : null}
      </div>
    </Root>
  )
}

export default Search
