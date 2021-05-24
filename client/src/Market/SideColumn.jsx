import React from 'react'
import Grid from '@material-ui/core/Grid'

import Doughnut from './Doughnut'

import StyledList from '../shared/components/StyledList'
import StyledListItem from '../shared/components/StyledListItem'

const TreasuryRates = ({ data }) => {
  return (
    <StyledList ariaLabelledBy='treasury rates' subheader='Treasury Rates'>
      <StyledListItem title='1 Year' value={data.oneYear} />
      <StyledListItem title='5 Year' value={data.fiveYear} />
      <StyledListItem title='10 Year' value={data.tenYear} />
    </StyledList>
  )
}

const ExchangeRates = ({ data }) => {
  return (
    <StyledList ariaLabelledBy='forex' subheader='USD Exchange Rate'>
      <StyledListItem title='USD/EUR' value={data.EURUSD} />
      <StyledListItem title='USD/GBP' value={data.GBPUSD} />
      <StyledListItem title='USD/JPY' value={data.USDJPY} />
    </StyledList>
  )
}

const EconomicData = ({ data }) => {
  return (
    <StyledList ariaLabelledBy='economic data' subheader='Economic Data'>
      <StyledListItem title='CPI - Urban' value={data.CPI} />
      <StyledListItem title='CC Interest Rate' value={data.CCInterestRate} />
      <StyledListItem title='Real GDP' value={data.GDP} />
    </StyledList>
  )
}

const padding = { padding: 24, paddingTop: 8, paddingBottom: 8 }

const SideColumn = ({
  treasuryRates,
  exchangeRates,
  economicData,
  recessionProbabilities,
}) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <TreasuryRates data={treasuryRates} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <ExchangeRates data={exchangeRates} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={padding}>
          <EconomicData data={economicData} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
          <Doughnut data={recessionProbabilities} />
        </div>
      </Grid>
    </Grid>
  )
}

export default SideColumn
