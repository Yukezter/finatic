import React from 'react'
import { styled } from '@mui/material/styles'
import { AxiosResponse } from 'axios'
import { useQuery, useQueries } from 'react-query'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper from '@mui/material/Popper'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { useEventSource } from '../../Hooks'
import { Icon, IconButton, DirectionIcon } from '../../Components'

const PREFIX = 'Lists'

const classes = {
  Popper: `${PREFIX}-Popper`,
  root: `${PREFIX}-root`,
}

const Root = styled('div')(
  ({ theme: { spacing, shadows, shape, zIndex, palette, breakpoints } }) => ({
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    marginBottom: spacing(4),
    '& > div': {
      paddingLeft: spacing(3),
      paddingRight: spacing(3),
    },
    '& > div:first-of-type': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: spacing(2),
      borderBottom: `1px solid ${palette.divider}`,
    },
    [breakpoints.up('xs')]: {
      boxShadow: shadows[5],
      borderRadius: shape.borderRadius,
    },

    [`& .${classes.Popper}`]: {
      zIndex: zIndex.mobileStepper,
    },
  })
)

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
          <Icon
            name='clock'
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
  const { isLoading, data } = useEventSource('http://localhost:8001/sse/fx', fxPairs)

  return isLoading ? (
    <SkeletonList length={data.length} />
  ) : (
    <List dense>
      {data.map(fxPair => (
        <StyledListItem
          key={fxPair.symbol}
          theme={theme}
          label={fxPair.symbol}
          value={
            <>
              {fxPair.data.rate}
              <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
            </>
          }
          timestamp={fxPair.data.timestamp}
        />
      ))}
    </List>
  )
}

const cryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTCUSD',
  },
  {
    name: 'Ethereum',
    symbol: 'ETHUSD',
  },
  {
    name: 'Litecoin',
    symbol: 'LTCUSD',
  },
  {
    name: 'Cardano',
    symbol: 'ADAUSDT',
  },
  {
    name: 'Solana',
    symbol: 'SOLUSDT',
  },
  {
    name: 'Shiba Inu',
    symbol: 'SHIBUSDT',
  },
]

const CryptoList = ({ theme }: any) => {
  const { isLoading, data } = useEventSource('http://localhost:8001/sse/cryptos', cryptos)

  return isLoading ? (
    <SkeletonList length={data.length} />
  ) : (
    <List dense>
      {data.map(crypto => (
        <StyledListItem
          key={crypto.name}
          theme={theme}
          label={crypto.name}
          value={
            <>
              {crypto.data.latestPrice}
              <span style={{ color: theme.palette.primary.main }}>&nbsp;USD</span>
            </>
          }
          timestamp={crypto.data.latestUpdate}
        />
      ))}
    </List>
  )
}

const commodities = ['Oil', 'Natural Gas', 'Heating Oil', 'Diesel', 'Gas', 'Propane']

const CommoditiesList = ({ theme }: any) => {
  const responses = useQueries([
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

  const isLoading = responses.some(response => !response.isSuccess)

  return isLoading ? (
    <SkeletonList length={6} />
  ) : (
    <List dense>
      {responses
        .map((response: any, index: number) => ({
          ...response.data.data[0],
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
  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>('/sector-performance')

  return !isSuccess ? (
    <SkeletonList length={11} />
  ) : (
    <List dense>
      {data!.data.map((sector: any) => (
        <StyledListItem
          key={sector.name}
          theme={theme}
          label={sector.name}
          value={
            <>
              <DirectionIcon value={sector.performance} />
              {(sector.performance * 100).toFixed(2)}%
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

const ListMenu = ({ selectedOption, setSelectedOption }: any) => {
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
        <Icon name='vertical-dots' height={30} width={30} />
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
          <Container disableGutters component={Paper} elevation={5}>
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

export default ({ theme }: any) => {
  const [selectedOption, setSelectedOption] = React.useState<MenuOption>(menuOptions[0])
  const { Component } = selectedOption

  return (
    <Root>
      <div>
        <Typography variant='h6' color='textPrimary'>
          {selectedOption.label}
        </Typography>
        <ListMenu
          classes={classes}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div>
        <Component theme={theme} />
      </div>
    </Root>
  )
}
