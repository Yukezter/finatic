/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Theme, createStyles, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import { group, abbreviate, percent } from '../../Utils/numberFormats'
import { Grid } from '../../Components'
import PriceDisplayAndChart from './PriceDisplayAndChart'

const useStyles = makeStyles(theme =>
  createStyles({
    statGrid: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    statsListItemText: {
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
  })
)

const Stats = ({ symbol, classes }: { symbol: string; classes: any }) => {
  const { isSuccess, data } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/stats`,
    cacheTime: 1000 * 30,
    select: res => [
      {
        name: 'Market cap',
        value: abbreviate(res.data.marketcap),
      },
      {
        name: '52 Wk High',
        value: group(res.data.week52high),
      },
      {
        name: '52 Wk Low',
        value: group(res.data.week52low),
      },
      {
        name: '52 Wk Change',
        value: group(res.data.week52change),
      },
      {
        name: 'Shares Outstanding',
        value: abbreviate(res.data.sharesOutstanding),
      },
      {
        name: 'P/E Ratio',
        value: group(res.data.peRatio),
      },
      {
        name: 'Div/Yield',
        value: percent(res.data.dividendYield),
      },
      {
        name: 'Beta',
        value: group(res.data.beta),
      },
      {
        name: 'Avg 10D Vol',
        value: abbreviate(res.data.avg10Volume),
      },
      {
        name: 'Avg 30D Vol',
        value: abbreviate(res.data.avg30Volume),
      },
      {
        name: 'TTM EPS',
        value: group(res.data.ttmEPS),
      },
      {
        name: 'TTM Dividend Rate',
        value: group(res.data.ttmDividendRate),
      },
      {
        name: '200 MDA',
        value: group(res.data.day200MovingAvg),
      },
      {
        name: '50 MDA',
        value: group(res.data.day50MovingAvg),
      },
      {
        name: '5Y Change',
        value: percent(res.data.year5ChangePercent),
      },
      {
        name: 'Max Change',
        value: percent(res.data.maxChangePercent),
      },
    ],
  })

  return (
    <div>
      <List dense>
        <Grid container spacing={3}>
          {(!isSuccess ? [...new Array(16)] : data).map((stat: any = {}) => (
            <Grid item xs={6} sm={3} classes={{ item: classes.statGrid }}>
              <ListItem disableGutters>
                {!isSuccess ? (
                  <Skeleton />
                ) : (
                  <ListItemText
                    className={classes.statsListItemText}
                    primary={stat.name}
                    primaryTypographyProps={{
                      noWrap: true,
                    }}
                    secondary={stat.value}
                    secondaryTypographyProps={{
                      noWrap: true,
                    }}
                  />
                )}
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
    </div>
  )
}

export default ({ theme }: { theme: Theme }) => {
  const classes = useStyles()
  const { symbol }: { symbol: string } = useParams()

  return (
    <>
      <Typography variant='h2' component='h1' style={{ lineHeight: 1 }}>
        {symbol}
      </Typography>
      <Grid container spacing={5} size='md'>
        <Grid item xs={12} lg={8}>
          <PriceDisplayAndChart theme={theme} symbol={symbol} />
          <Stats classes={classes} symbol={symbol} />
        </Grid>
        <Grid item xs={12} lg={4}>
          Wow
        </Grid>
      </Grid>
    </>
  )
}
