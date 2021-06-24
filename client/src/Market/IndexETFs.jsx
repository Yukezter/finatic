import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import Sparkline from './Sparkline'

import useEventSource from '../shared/hooks/useEventSource'
import useEventSourceListener from '../shared/hooks/useEventSourceListener'
import { toCurrency, toPercent } from '../shared/utils/numberFormat'

const useStyles = makeStyles(theme => ({
  root: {
    /* Scrollbar */
    overflowX: 'hidden',
    overflowY: 'hidden',
    scrollbarColor: `${theme.palette.common.black} transparent`,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'black',
      borderRadius: 4,
    },
    [theme.breakpoints.down('sm')]: {
      overflowX: 'scroll',
      marginBottom: theme.spacing(1),
    },
    /* Scrollbar */

    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    '& > div': {
      minWidth: theme.spacing(26),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
      '& > div': {
        minWidth: 'auto',
        width: '23.5%',
        marginRight: 0,
        marginBottom: 0,
      },
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    textDecoration: 'none',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    [theme.breakpoints.up('sm')]: {
      padding: 12,
    },
    [theme.breakpoints.up('md')]: {
      padding: 16,
    },
  },
  name: {
    display: 'initial',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'initial',
    },
  },
  sparklineWrapper: {
    height: 64,
    width: 'auto',
    padding: '12px 0',
  },
  latestPrice: {
    fontWeight: 600,
    lineHeight: 1,
  },
  changePercent: {
    lineHeight: 1,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 600,
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'rgba(253, 198, 0, 0.2)',
    borderRadius: 4,
    padding: '2px 4px',
    marginTop: 4,
    marginLeft: 'auto',
  },
}))

const IndexETF = ({ classes, esQuote, esSparkline, symbol, name }) => {
  const quote = useEventSourceListener(esQuote, symbol)
  const sparkline = useEventSourceListener(esSparkline, symbol)

  return (
    <Paper
      component={Link}
      // to={`/company/${symbol}`}
      to='/company/AAPL'
      className={classes.paper}
      elevation={0}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
        }}
      >
        <Typography variant='h4' style={{ fontWeight: 800, lineHeight: 1 }}>
          {quote.isLoading ? <Skeleton width={50} /> : symbol}
        </Typography>
        <Typography
          className={classes.changePercent}
          component='div'
          variant='caption'
          display='inline'
          noWrap
        >
          {quote.isLoading ? (
            <Skeleton width={30} />
          ) : (
            `${quote.data.changePercent > 0 ? '+' : ''} ${toPercent(quote.data.changePercent)}`
          )}
        </Typography>
      </div>
      <Typography variant='caption' className={classes.name}>
        {quote.isLoading ? <Skeleton width={100} /> : name}
      </Typography>
      <div className={classes.sparklineWrapper}>
        {sparkline.isLoading ? (
          <Skeleton variant='rect' height='100%' width='100%' />
        ) : (
          <Sparkline
            d={sparkline.data}
            labels={sparkline.data.flat().map(d => d.minute)}
            data={sparkline.data.flat().map(d => d.average)}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography className={classes.latestPrice} component='div' variant='h5'>
          {quote.isLoading ? <Skeleton width={60} /> : toCurrency(quote.data.latestPrice)}
        </Typography>
      </div>
    </Paper>
  )
}

const ETFs = [
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500',
  },
  {
    symbol: 'DIA',
    name: 'SPDR Dow Jones',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco NASDAQ',
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000',
  },
]

const symbolsParam = ETFs.map(etf => etf.symbol).join(',')

const IndexETFs = () => {
  const classes = useStyles()
  const esQuote = useEventSource(`/stock/quote?symbols=${symbolsParam}`)
  const esSparkline = useEventSource(`/stock/chart/1d?symbols=${symbolsParam}&sparkline=true`)

  return (
    <div className={classes.root}>
      {ETFs.map(ETF => (
        <div key={ETF.name}>
          <IndexETF esQuote={esQuote} esSparkline={esSparkline} classes={classes} {...ETF} />
        </div>
      ))}
    </div>
  )
}

export default IndexETFs
