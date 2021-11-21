/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { useQueries } from 'react-query'
import { Theme } from '@mui/material'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Hidden from '@mui/material/Hidden'

import {
  TagIcon,
  ProductionIcon,
  EconomyIcon,
  UnemploymentIcon,
  FederalFundsIcon,
  RecessionProbabilityIcon,
} from '../../Icons'
import MarketLists from './MarketLists'
import { MarketMoversTable, UpcomingEarningsTable } from './MarketTables'

const PREFIX = 'Market'

const classes = {
  cards: `${PREFIX}-cards`,
  card: `${PREFIX}-card`,
  economicDataIcon: `${PREFIX}-economicDataIcon`,
}

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  [`& .${classes.economicDataIcon}`]: {
    width: 42,
    height: 42,
    display: 'flex',
    marginRight: 16,
    color: theme.palette.primary.main,
  },
}))

const economicData = [
  {
    title: 'Consumer Price Index',
    Icon: TagIcon,
    queryKey: '/economy/cpi',
  },
  {
    title: 'Industrial Production Index',
    Icon: ProductionIcon,
    queryKey: '/economy/ipi',
  },
  {
    title: 'Gross Domestic Product',
    Icon: EconomyIcon,
    queryKey: '/economy/real-gdp',
  },
  {
    title: 'Federal Fund Rates',
    Icon: FederalFundsIcon,
    queryKey: '/economy/federal-funds',
  },
  {
    title: 'Unemployment Rate',
    Icon: UnemploymentIcon,
    queryKey: '/economy/unemployment-rate',
  },
  {
    title: 'Recession Probability',
    Icon: RecessionProbabilityIcon,
    queryKey: '/economy/recession-probability',
  },
]

const EconomicData = () => {
  const queries = useQueries(economicData.map(({ queryKey }) => ({ queryKey })))
  const isSuccess = queries.every(query => query.isSuccess)

  return (
    <>
      {queries.map((query, index) => {
        const { title, Icon } = economicData[index]
        return (
          <ListItem key={title} divider disableGutters>
            <Hidden smDown>
              <Box color={theme => theme.palette.primary.main} flexBasis={40}>
                <Icon height={20} width={20} />
              </Box>
            </Hidden>
            <ListItemText
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              primary={title}
              secondary={<>{!isSuccess ? <Skeleton width={60} /> : query.data}</>}
              secondaryTypographyProps={{ color: 'textPrimary' }}
            />
          </ListItem>
        )
      })}
    </>
  )
}

const Market = ({ theme }: { theme: Theme }) => {
  return (
    <Root>
      <Grid container rowSpacing={{ xs: 2, sm: 6 }} columnSpacing={{ md: 8 }}>
        <Grid container item xs={12} lg={8} rowSpacing={6}>
          <Grid item xs={12}>
            <Typography variant='h5' color='textPrimary' gutterBottom>
              Economic Data
            </Typography>
            <List dense>
              <EconomicData />
            </List>
          </Grid>
          <Grid item xs={12}>
            <MarketMoversTable />
          </Grid>
          <Grid item xs={12}>
            <UpcomingEarningsTable />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <MarketLists theme={theme} />
        </Grid>
      </Grid>
    </Root>
  )
}

export default Market
