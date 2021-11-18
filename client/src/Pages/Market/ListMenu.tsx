import React from 'react'
import { styled } from '@mui/material/styles'
import { useQuery, useQueries, UseQueryResult } from 'react-query'
import { useSnackbar } from 'notistack'
import { Theme } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper from '@mui/material/Popper'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { percent } from '../../Utils/numberFormats'
import { useQuotes } from '../../Hooks'
import { ClockIcon, VeritcalDotsIcon, MarketDirectionIcon } from '../../Icons'
import { IconButton } from '../../Components'

const PREFIX = 'Lists'

const classes = {
  selectedMenuItem: `${PREFIX}-selectedMenuItem`,
  Popper: `${PREFIX}-Popper`,
}

const Root = styled(Box)(({ theme }) => ({
  '& > div:first-of-type': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  [theme.breakpoints.up('xs')]: {
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
  },

  [`& .${classes.selectedMenuItem}`]: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },

  [`& .${classes.Popper}`]: {
    zIndex: theme.zIndex.mobileStepper,
  },
}))

const SkeletonList = ({ length = 5 }: { length: number }) => (
  <List dense>
    {Array.from(Array(length)).map((_, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <ListItem key={index} disableGutters>
        <ListItemText primary={<Skeleton width={80} />} secondary={<Skeleton width={60} />} />
        <ListItemText primary={<Skeleton />} />
      </ListItem>
    ))}
  </List>
)

const StyledListItem = ({ theme, label, value, timestamp }: any) => (
  <ListItem disableGutters>
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        noWrap: true,
      }}
      secondary={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockIcon
            height={14}
            style={{
              color: theme.palette.text.primary,
              marginRight: 6,
            }}
          />
          {new Date(timestamp).toLocaleTimeString('en-US', {
            hour12: false,
          })}
        </div>
      }
      secondaryTypographyProps={{
        variant: 'caption',
      }}
    />
    <ListItemText
      style={{ minWidth: 96 }}
      primary={value}
      primaryTypographyProps={{
        align: 'right',
        noWrap: true,
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
      }}
    />
  </ListItem>
)

const fxPairs = [
  {
    symbol: 'EURUSD',
  },
  {
    symbol: 'GBPUSD',
  },
  {
    symbol: 'USDJPY',
  },
  {
    symbol: 'AUDUSD',
  },
  {
    symbol: 'USDCAD',
  },
  {
    symbol: 'USDCHF',
  },
]

const FxRatesList = ({ theme }: any) => {
  const { isLoading, data } = useQuotes('/forex', fxPairs, {
    errorSnackbar: true,
    errorMessage: 'An error occurred while requesting forex rates.',
  })

  return isLoading ? (
    <SkeletonList length={fxPairs.length} />
  ) : (
    <List dense>
      {data.map(symbolData => (
        <StyledListItem
          key={symbolData.symbol}
          theme={theme}
          label={symbolData.symbol}
          value={
            <>
              {symbolData.data.rate}
              <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
            </>
          }
          timestamp={symbolData.data.timestamp}
        />
      ))}
    </List>
  )
}

const cryptos = [
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
  },
  {
    symbol: 'LTCUSD',
    name: 'Litecoin',
  },
  {
    symbol: 'ADAUSDT',
    name: 'Cardano',
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
  },
  {
    symbol: 'SHIBUSDT',
    name: 'Shiba Inu',
  },
]

const CryptoList = ({ theme }: any) => {
  const { isLoading, data } = useQuotes('/cryptos', cryptos, {
    errorSnackbar: true,
    errorMessage: 'An error occurred while requesting cryptocurrency prices.',
  })

  return isLoading ? (
    <SkeletonList length={cryptos.length} />
  ) : (
    <List dense>
      {data.map(symbolData => (
        <StyledListItem
          key={symbolData.props.name}
          theme={theme}
          label={symbolData.props.name}
          value={
            <>
              {symbolData.data.latestPrice}
              <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
            </>
          }
          timestamp={symbolData.data.latestUpdate}
        />
      ))}
    </List>
  )
}

const commodities = ['Oil', 'Natural Gas', 'Heating Oil', 'Diesel', 'Gas', 'Propane']

const CommoditiesList = ({ theme }: any) => {
  const queries = useQueries([
    {
      queryKey: '/commodities/oil',
    },
    {
      queryKey: '/commodities/natural-gas',
    },
    {
      queryKey: '/commodities/heating-oil',
    },
    {
      queryKey: '/commodities/diesel',
    },
    {
      queryKey: '/commodities/gas',
    },
    {
      queryKey: '/commodities/propane',
    },
  ])

  const isSuccess = queries.every(query => query.isSuccess)
  const isError = queries.every(query => query.isError)

  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (isError) {
      enqueueSnackbar('An error occurred while requesting commodity prices.', {
        variant: 'error',
      })
    }
  }, [isError])

  return !isSuccess ? (
    <SkeletonList length={6} />
  ) : (
    <List dense>
      {queries
        .map((query: UseQueryResult<any>, index) => ({
          ...query.data[0],
          label: commodities[index],
        }))
        .map((commodity: any) => (
          <StyledListItem
            key={commodity.label}
            theme={theme}
            label={commodity.label}
            value={
              <>
                {commodity.value}
                <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
              </>
            }
            timestamp={commodity.updated}
          />
        ))}
    </List>
  )
}

const SectorList = ({ theme }: any) => {
  const { enqueueSnackbar } = useSnackbar()
  const { isSuccess, data } = useQuery<any, Error>('/sector-performance', {
    onError: err => {
      enqueueSnackbar('An error occurred while requesting sector performance data.', {
        variant: 'error',
      })
      console.log(err)
    },
  })

  return !isSuccess ? (
    <SkeletonList length={11} />
  ) : (
    <List dense>
      {data.map((sector: any) => (
        <StyledListItem
          key={sector.name}
          theme={theme}
          label={sector.name}
          value={
            <>
              <MarketDirectionIcon value={sector.performance} />
              {percent(sector.performance)}
            </>
          }
          timestamp={sector.lastUpdated}
        />
      ))}
    </List>
  )
}

type MenuOption = {
  label: string
  Component: (props: any) => JSX.Element
}

const menuOptions: MenuOption[] = [
  {
    label: 'Sector Performance',
    Component: SectorList,
  },
  {
    label: 'Cryptocurrencies',
    Component: CryptoList,
  },
  {
    label: 'Forex Rates',
    Component: FxRatesList,
  },
  {
    label: 'Commodities',
    Component: CommoditiesList,
  },
]

type ListMenuProps = {
  selectedOption: MenuOption
  setSelectedOption: React.Dispatch<React.SetStateAction<MenuOption>>
}

const ListMenu = ({ selectedOption, setSelectedOption }: ListMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen(prevState => !prevState)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleSelect = (option: MenuOption) => () => {
    setSelectedOption(option)
    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div>
      <IconButton
        ref={anchorRef}
        id='top-movers-button'
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        size='large'
      >
        <VeritcalDotsIcon height={30} width={30} />
      </IconButton>
      <Popper
        className={classes.Popper}
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        role={undefined}
        keepMounted
        disablePortal
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Container
            disableGutters
            component={Paper}
            elevation={5}
            style={{ backgroundImage: 'none' }}
          >
            <MenuList
              id='menu-list-grow'
              aria-labelledby='top-movers-button'
              autoFocus={open}
              onKeyDown={handleListKeyDown}
            >
              {menuOptions.map(option => (
                <MenuItem
                  key={option.label}
                  classes={{ selected: classes.selectedMenuItem }}
                  selected={option.label === selectedOption.label}
                  onClick={handleSelect(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Container>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default ({ theme }: { theme: Theme }) => {
  const [selectedOption, setSelectedOption] = React.useState<MenuOption>(menuOptions[0])
  const { Component } = selectedOption

  return (
    <Root py={2} mb={4}>
      <Box px={3}>
        <Typography variant='h6' color='textPrimary'>
          {selectedOption.label}
        </Typography>
        <ListMenu selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </Box>
      <Box px={3}>
        <Component theme={theme} />
      </Box>
    </Root>
  )
}
