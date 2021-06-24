import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { useQueries } from 'react-query'

import IndexETFs from './IndexETFs'
import Table from './Table'
import SideColumn from './SideColumn'

import useEventSource from '../shared/hooks/useEventSource'
import useEventSourceListener from '../shared/hooks/useEventSourceListener'
import StyledList from '../shared/components/StyledList'
import StyledListItem from '../shared/components/StyledListItem'
import { toCurrency, toPercent } from '../shared/utils/numberFormat'

const useStyles = makeStyles(theme => ({
  sideColumn: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
}))

const getMinutes = minutes => {
  if (minutes >= 10) return minutes
  return `0${minutes}`
}

const getTime = (hours, minutes) => {
  if (hours >= 13) return `${hours - 12}:${getMinutes(minutes)} PM`
  return `${hours}:${getMinutes(minutes)} AM`
}

const getDate = timestamp => {
  const t = new Date(timestamp)
  return `${t.getMonth()}/${t.getDay()} ${getTime(t.getHours(), t.getMinutes())}`
}
const CryptoListItem = ({ esQuote, symbol, title, titleSecondary }) => {
  const quote = useEventSourceListener(esQuote, symbol)

  return (
    <StyledListItem
      isLoading={quote.isLoading}
      title={title}
      titleSecondary={titleSecondary}
      value={quote.isLoading ? null : toCurrency(quote.data.latestPrice)}
      valueSecondary={
        quote.isLoading ? null : !quote.data.previousClose ? (
          <i>as of: {getDate(quote.data.latestUpdate)}</i>
        ) : (
          toPercent(quote.data.previousClose)
        )
      }
    />
  )
}

const Cryptocurrencies = () => {
  const esQuote = useEventSource(`/crypto/quote?symbols=btcusd,ethusd,ltcusd`)
  return (
    <StyledList ariaLabelledBy='cryptocurrencies' subheader='Cryptocurrencies'>
      <CryptoListItem esQuote={esQuote} symbol='btcusd' title='BTC' titleSecondary='Bitcoin' />
      <CryptoListItem esQuote={esQuote} symbol='ethusd' title='ETH' titleSecondary='Ethereum' />
      <CryptoListItem esQuote={esQuote} symbol='ltcusd' title='LTC' titleSecondary='Litecoin' />
    </StyledList>
  )
}

const Commodities = () => {
  const responses = useQueries([
    {
      queryKey: '/data-points/market/DCOILWTICO',
    },
    {
      queryKey: '/data-points/market/GASREGCOVW',
    },
    {
      queryKey: '/data-points/market/DJFUELUSGULF',
    },
  ])

  return (
    <StyledList ariaLabelledBy='commodities' subheader='Commodities'>
      <StyledListItem
        isLoading={responses[0].isLoading}
        title='Crude Oil'
        titleSecondary='West Texas Immediate'
        value={responses[0].data}
        valueSecondary='/barrel'
      />
      <StyledListItem
        isLoading={responses[1].isLoading}
        title='Gasoline'
        titleSecondary='US Regular Conventional'
        value={responses[1].data}
        valueSecondary='/gal'
      />
      <StyledListItem
        isLoading={responses[2].isLoading}
        title='Jet Fuel'
        titleSecondary='US Gulf Coast Kerosense'
        value={responses[2].data}
        valueSecondary='/gal'
      />
    </StyledList>
  )
}

let renders = 0

const Market = () => {
  console.log('Market renders:', ++renders)

  const classes = useStyles()

  return (
    <div>
      <IndexETFs />
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className={classes.sideColumn}>
            <SideColumn />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div style={{ marginBottom: 32 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Cryptocurrencies />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Commodities />
              </Grid>
            </Grid>
          </div>
          <Table />
        </Grid>
      </Grid>
    </div>
  )
}
export default Market
