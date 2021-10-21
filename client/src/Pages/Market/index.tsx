/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import {
  Theme,
  makeStyles,
  createStyles,
  // alpha,
  useMediaQuery,
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'

import { Icon } from '../../Components'
import Lists from './Lists'
import Tables from './Tables'

const useStyles = makeStyles(theme =>
  createStyles({
    cards: {
      // overflow: 'hidden',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(5),
    },
    card: {
      '& > div': {
        display: 'flex',
        '& > span': {
          width: 42,
          height: 42,
          display: 'flex',
          marginRight: 16,
          color: theme.palette.primary.main,
        },
      },
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        // height: 160,
        // padding: theme.spacing(2.5),
        // border: `1px solid ${theme.palette.divider}`,
        // background: alpha(theme.palette.secondary.dark, 0.2),
        '& > div': {
          // height: '100%',
          // justifyContent: 'space-between',
          flexDirection: 'column',
          // alignItems: 'center',
          // textAlign: 'center',
        },
      },
    },
  })
)

const economicData = [
  {
    title: 'Consumer Price Index',
    icon: 'tag',
    queryKey: '/cpi',
  },
  {
    title: 'Industrial Production Index',
    icon: 'production',
    queryKey: '/ipi',
  },
  {
    title: 'Gross Domestic Product',
    icon: 'economy',
    queryKey: '/real-gdp',
  },
  {
    title: 'Federal Fund Rates',
    icon: 'unemployment',
    queryKey: '/federal-funds',
  },
  {
    title: 'Unemployment Rate',
    icon: 'unemployment',
    queryKey: '/unemployment-rate',
  },
  {
    title: 'Recession Probability',
    icon: 'unemployment',
    queryKey: '/recession-probability',
  },
]

const EconomicDataCard = ({ classes, icon, title, queryKey }: any) => {
  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>(`economy/${queryKey}`)

  return (
    <div className={classes.card}>
      <div>
        <span>
          <Icon name={icon} height={28} width={28} style={{ margin: 'auto' }} />
        </span>
        <div>
          <Typography variant='body2'>{title}</Typography>
          {!isSuccess ? (
            <Skeleton />
          ) : (
            <Typography variant='h6' gutterBottom>
              {data!.data}
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}

const Market: React.FC<{ theme: Theme }> = ({ theme }: { theme: Theme }) => {
  const classes = useStyles()
  const matches = useMediaQuery(({ breakpoints }: Theme) => breakpoints.up('lg'))

  return (
    <Grid container spacing={matches ? 5 : 0}>
      <Grid item xs={12} lg={8}>
        <Typography variant='h2' style={{ marginBottom: 32 }}>
          Markets
        </Typography>
        <Typography variant='h5' paragraph>
          Economic Data
        </Typography>
        <Divider />
        <div className={classes.cards}>
          <Grid container spacing={2}>
            {economicData.map(props => (
              <Grid item xs={6} sm={6}>
                <EconomicDataCard classes={classes} {...props} />
              </Grid>
            ))}
          </Grid>
        </div>
        <Tables />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Lists theme={theme} />
      </Grid>
      {/* <Grid item xs={12} sm={6} lg={8}>
    
  </Grid> */}
    </Grid>
  )
}

export default Market
