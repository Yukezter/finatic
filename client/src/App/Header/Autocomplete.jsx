import React from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import { useAutocomplete, createFilterOptions } from '@material-ui/lab'

import { ReactComponent as SearchIcon } from '../../shared/icons/loupe.svg'

import useMergeState from '../../shared/hooks/useMergeState'
import api from '../../shared/utils/api'

import Icon from '../../shared/components/Icon'

// Loop through array
// Pop element with a random number between 0 and the current length of the array
// Check if string length is less than n
// Push to new array if true
const sectors = _.sampleSize(
  [
    // { name: 'Other Services (except Public Administration)' },
    { name: 'Commercial Services' },
    { name: 'Retail Trade' },
    { name: 'Distribution Services' },
    { name: 'Process Industries' },
    // { name: 'Professional, Scientific, and Technical Services' },
    { name: 'Wholesale Trade' },
    // { name: 'Administrative and Support and Waste Management and Remediation Services' },
    { name: 'Technology Services' },
    { name: 'Educational Services' },
    { name: 'Consumer Durables' },
    { name: 'Miscellaneous' },
    { name: 'Government' },
    // { name: 'Real Estate and Rental and Leasing' },
    { name: 'Consumer Non-Durables' },
    { name: 'Communications' },
    { name: 'Health Services' },
    { name: 'Finance' },
    { name: 'Producer Manufacturing' },
    { name: 'Manufacturing' },
    { name: 'Information' },
    // { name: 'Health Care and Social Assistance' },
    { name: 'Transportation' },
    // { name: 'Agriculture, Forestry, Fishing and Hunting' },
    // { name: 'Accommodation and Food Services' },
    { name: 'Energy Minerals' },
    { name: 'Health Technology' },
    { name: 'Construction' },
    { name: 'Public Administration' },
    // { name: 'Arts, Entertainment, and Recreation' },
    // { name: 'Mining, Quarrying, and Oil and Gas Extraction' },
    { name: 'Consumer Services' },
    { name: 'Finance and Insurance' },
    { name: 'Utilities' },
    // { name: 'Management of Companies and Enterprises' },
    { name: 'Non-Energy Minerals' },
    { name: 'Electronic Technology' },
    { name: 'Transportation and Warehousing' },
    { name: 'Industrial Services' },
  ],
  8,
)

const useStyles = makeStyles(({ palette, spacing, typography, breakpoints }) => {
  // const background = palette.secondary.main
  const background = palette.common.white
  const borderColor = 'rgba(0, 0, 0, 0.23)'
  const borderColorHover = palette.common.black
  const borderColorFocus = palette.common.black
  const borderColorDialog = 'transparent'
  const pX = spacing(3)
  const pXDialog = spacing(2)

  return {
    root: ({ fromDialog }) => ({
      maxWidth: fromDialog ? '100%' : 420,
      width: '100%',
      height: spacing(4.5),
      position: 'relative',
      [breakpoints.up('lg')]: {
        maxWidth: 500,
      },
    }),
    wrapper: ({ fromDialog }) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: fromDialog ? borderColorDialog : borderColor,
      borderRadius: spacing(0.75),
      transition: 'border-color 300ms ease 0s',
      '&:hover': {
        background,
        borderColor: fromDialog ? borderColorDialog : borderColorHover,
      },
      '&:focus-within': {
        background,
        borderColor: fromDialog ? borderColorDialog : borderColorFocus,
        '& svg': {
          color: palette.text.primary,
        },
      },
    }),
    textField: {
      height: spacing(4.5),
      position: 'initial',
      padding: 0,
    },
    inputRoot: {
      height: spacing(4.5),
      position: 'initial',
    },
    notchedOutline: {
      border: 'none',
    },
    input: {
      height: spacing(4.5),
      paddingLeft: 0,
      '&::placeholder': {
        color: 'rgba(0, 0, 0, 0.54)',
        opacity: 1,
      },
    },
    paper: {
      width: '100%',
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      overflow: 'hidden',
      background,
      borderRadius: spacing(0.75),
    },
    title: ({ fromDialog }) => ({
      color: palette.common.black,
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      paddingLeft: fromDialog ? pXDialog : pX,
      paddingRight: fromDialog ? pXDialog : pX,
    }),
    listbox: {
      width: '100%',
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    item: ({ fromDialog }) => ({
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      paddingTop: spacing(0.75),
      paddingBottom: spacing(0.75),
      paddingLeft: fromDialog ? pXDialog : pX,
      paddingRight: fromDialog ? pXDialog : pX,
      '&[data-focus="true"]': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '&:active': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
      '& > div': {
        display: 'flex',
      },
      '& > div > span': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
      '& > div > span:first-child': {
        width: spacing(12),
        marginRight: spacing(1),
      },
    }),
    stocks: {
      marginBottom: spacing(1),
    },
    sectors: {
      marginBottom: spacing(1),
    },
    defaultDialogContent: ({ fromDialog }) => ({
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      paddingLeft: fromDialog ? pXDialog : pX,
      paddingRight: fromDialog ? pXDialog : pX,
    }),
    noResults: ({ fromDialog }) => ({
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      paddingLeft: fromDialog ? pXDialog : pX,
      paddingRight: fromDialog ? pXDialog : pX,
    }),
    chips: ({ fromDialog }) => ({
      paddingLeft: fromDialog ? pXDialog : pX,
      paddingRight: fromDialog ? pXDialog : pX,
      '& > div': {
        marginRight: spacing(0.5),
        marginBottom: spacing(1),
        fontFamily: typography.body1.fontFamily,
        background: palette.common.white,
        color: palette.common.black,
        borderColor: palette.common.black,
      },
    }),
  }
})

const addParts = inputValue => option => {
  const getParts = text => {
    const regex = new RegExp(`(${_.escapeRegExp(inputValue)})`, 'gi')
    return text.split(regex).map(part => ({
      part,
      isHighlighted: part.toLowerCase() === inputValue.toLowerCase(),
    }))
  }

  option.parts = {
    symbol: getParts(option.symbol),
    securityName: getParts(option.securityName),
  }

  return option
}

const highlight = (parts, color) => {
  return parts.map(({ part, isHighlighted }, index) => (
    <span key={index} style={{ color: isHighlighted ? color : 'initial' }}>
      {part}
    </span>
  ))
}

const fetch = _.debounce(async (inputValue, successCb, errorCb) => {
  api
    .get(`/search/${inputValue}`)
    .then(({ data }) => successCb(data))
    .catch(error => errorCb(error))
}, 100)

// let popupCount = 0

const Popup = ({
  classes,
  theme,
  getListboxProps,
  getOptionProps,
  popupOpen,
  options,
  noResults,
  fromDialog,
}) => {
  // console.log('Popup:', ++popupCount)

  const highlightColor = theme.palette.primary.main

  return popupOpen ? (
    <Paper className={classes.paper} elevation={0}>
      {!!options.length ? (
        <>
          <div className={classes.stocks}>
            <Typography variant='body2' component='p' color='textSecondary' className={classes.title}>
              Stocks
            </Typography>
            <ul className={classes.listbox} {...getListboxProps()}>
              {options.map((option, index) => (
                <li className={classes.item} {...getOptionProps({ option, index })}>
                  <div>
                    <Typography variant='body2' component='span'>
                      {highlight(option.parts.symbol, highlightColor)}
                    </Typography>
                    <Typography variant='body2' component='span'>
                      {highlight(option.parts.securityName, highlightColor)}
                    </Typography>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.sectors}>
            <Typography variant='body2' component='p' color='textSecondary' className={classes.title}>
              Sectors
            </Typography>
            <div className={classes.chips}>
              {sectors.map(({ name }) => (
                <Chip key={name} label={name} size='small' variant='outlined' clickable />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {fromDialog && !noResults ? (
            <div className={classes.defaultDialogContent}>
              <Typography variant='body2' component='span'>
                From dialog.
              </Typography>
            </div>
          ) : (
            noResults && (
              <div className={classes.noResults}>
                <Typography variant='body2' component='span'>
                  No stonks found.
                </Typography>
              </div>
            )
          )}
        </>
      )}
    </Paper>
  ) : null
}

let count = 0

const Autocomplete = React.forwardRef((props, inputRef) => {
  console.log('search:', ++count)

  const { theme, history, fromDialog } = props

  const [state, mergeState] = useMergeState({
    inputValue: '',
    open: false,
    options: [],
    noResults: false,
  })

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: ({ symbol, securityName }) => {
      return symbol + ' ' + securityName
    },
  })

  React.useEffect(() => {
    let active = true

    if (!state.inputValue.trim()) return

    fetch(
      state.inputValue,
      options => {
        if (active) {
          console.log(options, options.map(addParts(state.inputValue)))
          mergeState({
            open: true,
            options: options.map(addParts(state.inputValue)),
            noResults: !options.length,
          })
        }
      },
      error => {
        if (active) {
          console.log(error)

          mergeState({
            open: false,
            options: [],
            noResults: false,
          })
        }
      },
    )

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inputValue])

  const onInputChange = (_event, inputValue, reason) => {
    if (reason === 'input') {
      const newState = {
        inputValue,
      }

      if (!inputValue.trim()) {
        newState.open = false
        newState.options = []
        newState.noResults = false
      }

      mergeState(newState)
    }
  }

  const onChange = (_event, newValue, reason) => {
    if (reason === 'select-option' && newValue) {
      history.push(`/company/${newValue.symbol}`)
      mergeState({ open: false })
    }
  }

  const onOpen = () => {
    if (!state.open) {
      mergeState({ open: true })
    }
  }

  const onClose = (event, reason) => {
    if (reason === 'blur') {
      mergeState({ open: false })
    }
  }

  const autocompleteProps = {
    id: 'search-autocomplete',
    options: state.options,
    getOptionLabel: ({ securityName }) => securityName,
    filterOptions,
    inputValue: state.inputValue,
    value: null,
    onInputChange,
    onChange,
    onOpen,
    onClose,
  }

  const open = (state.open && !!state.options.length) || (state.open && state.noResults)
  autocompleteProps.open = fromDialog ? true : open

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    popupOpen,
  } = useAutocomplete(autocompleteProps)

  const classes = useStyles({ fromDialog, popupOpen: open })

  return (
    <div className={classes.root}>
      <div {...getRootProps()} className={classes.wrapper}>
        <TextField
          className={classes.textField}
          fullWidth
          size='small'
          variant='outlined'
          hiddenLabel
          aria-label='search'
          placeholder='Stonks...'
          InputLabelProps={{
            ...getInputLabelProps(),
          }}
          InputProps={{
            ...getInputProps(),
            inputRef,
            classes: {
              root: classes.inputRoot,
              notchedOutline: classes.notchedOutline,
            },
            startAdornment: <Icon classes={{ icon: classes.icon }} Icon={SearchIcon} />,
          }}
          inputProps={{
            className: classes.input,
          }}
        />
        <Popup
          classes={classes}
          theme={theme}
          options={state.options}
          noResults={state.noResults}
          getListboxProps={getListboxProps}
          getOptionProps={getOptionProps}
          popupOpen={popupOpen}
          fromDialog={fromDialog}
        />
      </div>
    </div>
  )
})

export default Autocomplete
