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
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { percent } from '../../Utils/numberFormats'
import { useQuotes } from '../../Hooks'
import { ClockIcon, VeritcalDotsIcon, MarketDirectionIcon } from '../../Icons'
import { IconButton, MenuItem } from '../../Components'

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

  [`& .${classes.Popper}`]: {
    zIndex: theme.zIndex.mobileStepper,
  },
}))

const SkeletonListItem = () => (
  <ListItem disableGutters>
    <ListItemText primary={<Skeleton width={80} />} secondary={<Skeleton width={60} />} />
    <ListItemText primary={<Skeleton />} />
  </ListItem>
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
            width={14}
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
      primary={
        <>
          {value}
          <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
        </>
      }
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
  {
    symbol: 'USDHKD',
  },
  {
    symbol: 'NZDUSD',
  },
]

const FxRatesList = ({ theme }: any) => {
  const quotes = useQuotes('/forex', fxPairs, {
    errorSnackbar: true,
    errorMessage: 'An error occurred while requesting forex rates.',
  })

  return (
    <List dense>
      {quotes.data.map(({ symbol, data }) =>
        data === undefined ? (
          <SkeletonListItem />
        ) : (
          <StyledListItem
            key={symbol}
            theme={theme}
            label={symbol}
            value={data.rate}
            timestamp={data.timestamp}
          />
        )
      )}
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
    symbol: 'ADAUSD',
    name: 'Cardano',
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana',
  },
  {
    symbol: 'SHIBUSD',
    name: 'Shiba Inu',
  },
  {
    symbol: 'DOGEUSD',
    name: 'Dogecoin',
  },
  {
    symbol: 'ALGOUSD',
    name: 'Algorand',
  },
  {
    symbol: 'XLMUSD',
    name: 'Stellar Lumens',
  },
]

const CryptoList = ({ theme }: any) => {
  const quotes = useQuotes('/cryptos', cryptos, {
    errorSnackbar: true,
    errorMessage: 'An error occurred while requesting cryptocurrency prices.',
  })

  return (
    <List dense>
      {quotes.data.map(({ symbol, data }) =>
        data === undefined ? (
          <SkeletonListItem />
        ) : (
          <StyledListItem
            key={symbol}
            theme={theme}
            label={symbol}
            value={data.latestPrice}
            timestamp={data.latestUpdate}
          />
        )
      )}
    </List>
  )
}

const commodities = ['Oil', 'Natural Gas', 'Heating Oil', 'Diesel', 'Gas', 'Propane']

const CommoditiesList = ({ theme }: any) => {
  const { enqueueSnackbar } = useSnackbar()
  const snackbarError = () => {
    enqueueSnackbar('An error occurred while requesting commodity prices.', {
      variant: 'error',
    })
  }

  const queries = useQueries(
    [
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
    ].map(options => ({
      ...options,
      onError: () => snackbarError(),
    }))
  )

  return (
    <List dense>
      {(queries as UseQueryResult<any>[]).map(({ data, isSuccess }, index) =>
        !isSuccess ? (
          <SkeletonListItem />
        ) : (
          <StyledListItem
            key={commodities[index]}
            theme={theme}
            label={commodities[index]}
            value={data[0].value}
            timestamp={data[0].updated}
          />
        )
      )}
    </List>
  )
}

const SectorList = ({ theme }: any) => {
  const { enqueueSnackbar } = useSnackbar()
  const { isSuccess, data } = useQuery<any, Error>('/sector-performance', {
    onError: () => {
      enqueueSnackbar('An error occurred while requesting sector performance data.', {
        variant: 'error',
      })
    },
  })

  return (
    <List dense>
      {!isSuccess
        ? Array.from(new Array(11)).map(() => <SkeletonListItem />)
        : data.map((sector: any) => (
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
                  selected={option.label === selectedOption.label}
                  onClick={handleSelect(option)}
                  sx={{ px: 2, minWidth: 140 }}
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
