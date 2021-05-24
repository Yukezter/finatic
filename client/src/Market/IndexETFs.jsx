import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Sparkline from './Sparkline'
import SocketContext from '../shared/context/SocketContext'

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

const IndexETF = ({ classes, socket, symbol, name }) => {
  const [quote, setQuote] = React.useState({
    latestPrice: null,
    change: null,
    changePercent: null,
  })

  const listener = React.useCallback(newQuote => {
    setQuote({
      latestPrice: newQuote.latestPrice,
      change: newQuote.change,
      changePercent: newQuote.changePercent,
    })
  }, [])

  React.useEffect(() => {
    socket.on(symbol, listener)
    return () => socket.off(symbol, listener)
  })

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
          {symbol}
        </Typography>
        <Typography
          className={classes.changePercent}
          component='div'
          variant='caption'
          display='inline'
          noWrap
        >
          {quote.changePercent > 0 ? '+ ' : '- '}
          {toPercent(quote.changePercent)}
          {/* {0.43 > 0 ? '+ ' : '- '} */}
          {/* {toPercent(0.43)} */}
        </Typography>
      </div>
      <Typography variant='caption' className={classes.name}>
        {name}
      </Typography>
      <div className={classes.sparklineWrapper}>
        <Sparkline />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography className={classes.latestPrice} component='div' variant='h5'>
          {toCurrency(quote.latestPrice)}
          {/* {toCurrency(243.54)} */}
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

const IndexETFs = () => {
  const classes = useStyles()
  const socket = React.useContext(SocketContext)

  const subscribe = React.useCallback(() => {
    socket.emit(
      'subscribe',
      ETFs.map(ETF => ETF.symbol),
    )
  }, [socket])

  const unsubscribe = React.useCallback(() => {
    socket.emit(
      'unsubscribe',
      ETFs.map(ETF => ETF.symbol),
    )
  }, [socket])

  React.useEffect(() => {
    subscribe()
    return () => unsubscribe()
  }, [subscribe, unsubscribe])

  return (
    <div className={classes.root}>
      {ETFs.map(ETF => (
        <div key={ETF.symbol}>
          <IndexETF
            classes={classes}
            socket={socket}
            symbol={ETF.symbol}
            name={ETF.name}
          />
        </div>
      ))}
    </div>
  )
}

export default IndexETFs
