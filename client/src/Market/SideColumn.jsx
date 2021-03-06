import React from 'react'
import { useQuery, useQueries } from 'react-query'
import Grid from '@material-ui/core/Grid'

import Doughnut from './Doughnut'

import StyledList from '../shared/components/StyledList'
import StyledListItem from '../shared/components/StyledListItem'

const TreasuryRates = () => {
  const responses = useQueries([
    {
      queryKey: '/data-points/market/DGS1',
    },
    {
      queryKey: '/data-points/market/DGS5',
    },
    {
      queryKey: '/data-points/market/DGS10',
    },
  ])

  return (
    <StyledList ariaLabelledBy='treasury rates' subheader='Treasury Rates'>
      <StyledListItem
        isLoading={responses[0].isLoading}
        title='1 Year'
        value={responses[0].data}
      />
      <StyledListItem
        isLoading={responses[1].isLoading}
        title='5 Year'
        value={responses[1].data}
      />
      <StyledListItem
        isLoading={responses[2].isLoading}
        title='10 Year'
        value={responses[2].data}
      />
    </StyledList>
  )
}

const ExchangeRates = () => {
  const { isLoading, data } = useQuery({
    queryKey: '/fx/latest?symbols=EURUSD,GBPUSD,USDJPY',
  })

  return (
    <StyledList ariaLabelledBy='forex' subheader='USD Exchange Rate'>
      <StyledListItem
        isLoading={isLoading}
        title='USD/EUR'
        value={!isLoading && data[0].rate}
      />
      <StyledListItem
        isLoading={isLoading}
        title='USD/GBP'
        value={!isLoading && data[1].rate}
      />
      <StyledListItem
        isLoading={isLoading}
        title='USD/JPY'
        value={!isLoading && data[2].rate}
      />
    </StyledList>
  )
}

const EconomicData = () => {
  const responses = useQueries([
    {
      queryKey: '/data-points/market/CPIAUCSL',
    },
    {
      queryKey: '/data-points/market/TERMCBCCALLNS',
    },
    {
      queryKey: '/data-points/market/A191RL1Q225SBEA',
    },
  ])

  return (
    <StyledList ariaLabelledBy='economic data' subheader='Economic Data'>
      <StyledListItem
        isLoading={responses[0].isLoading}
        title='CPI - Urban'
        value={responses[0].data}
      />
      <StyledListItem
        isLoading={responses[1].isLoading}
        title='CC Interest Rate'
        value={responses[1].data}
      />
      <StyledListItem
        isLoading={responses[2].isLoading}
        title='Real GDP'
        value={responses[2].data}
      />
    </StyledList>
  )
}

const padding = { padding: 24, paddingTop: 8, paddingBottom: 8 }

const SideColumn = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <TreasuryRates />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <ExchangeRates />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <EconomicData />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
          <Doughnut />
        </div>
      </Grid>
    </Grid>
  )
}

export default SideColumn
