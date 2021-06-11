import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import IndexETFs from './IndexETFs'
import Table from './Table'
import SideColumn from './SideColumn'

import StyledList from '../shared/components/StyledList'
import StyledListItem from '../shared/components/StyledListItem'

const useStyles = makeStyles(theme => ({
  sideColumn: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
}))

const Cryptocurrencies = ({ data }) => {
  const { BTC, ETH, LTC } = data
  return (
    <StyledList ariaLabelledBy='cryptocurrencies' subheader='Cryptocurrencies'>
      <StyledListItem
        title='BTC'
        titleSecondary='Bitcoin'
        value={BTC.latestPrice}
        valueSecondary={BTC.changePercent}
      />
      <StyledListItem
        title='ETH'
        titleSecondary='Ethereum'
        value={ETH.latestPrice}
        valueSecondary={ETH.changePercent}
      />
      <StyledListItem
        title='LTC'
        titleSecondary='Litecoin'
        value={LTC.latestPrice}
        valueSecondary={LTC.changePercent}
      />
    </StyledList>
  )
}

const Commodities = ({ data }) => {
  return (
    <StyledList ariaLabelledBy='commodities' subheader='Commodities'>
      <StyledListItem
        title='Crude Oil'
        titleSecondary='West Texas Immediate'
        value={data.oil}
        valueSecondary='/barrel'
      />
      <StyledListItem
        title='Gasoline'
        titleSecondary='US Regular Conventional'
        value={data.gas}
        valueSecondary='/gal'
      />
      <StyledListItem
        title='Jet Fuel'
        titleSecondary='US Gulf Coast Kerosense'
        value={data.jetFuel}
        valueSecondary='/gal'
      />
    </StyledList>
  )
}

let renders = 0

const Market = () => {
  console.log('Market renders:', ++renders)

  const classes = useStyles()

  // const commodities = useQueries([
  //   {
  //     queryKey: '/data-points/market/DCOILWTICO',
  //   },
  //   {
  //     queryKey: '/data-points/market/GASREGCOVW',
  //   },
  //   {
  //     queryKey: '/data-points/market/DJFUELUSGULF',
  //   }
  // ])

  // const cryptocurrencies = useQueries([
  //   {
  //     queryKey: '/crypto/btcusd/quote',
  //   },
  //   {
  //     queryKey: '/crypto/btcusd/ethusc',
  //   },
  //   {
  //     queryKey: '/crypto/btcusd/ltcusd',
  //   }
  // ])

  return (
    <div>
      {/* <IndexETFs /> */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className={classes.sideColumn}>
            <SideColumn />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          {/* <div style={{ marginBottom: 32 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Cryptocurrencies data={cryptocurrencies} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Commodities data={commodities} />
              </Grid>
            </Grid>
          </div>
          <Table /> */}
        </Grid>
      </Grid>
    </div>
  )
}
export default Market
