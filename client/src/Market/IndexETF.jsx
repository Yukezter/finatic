import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Sparkline from './Sparkline'

import { toCurrency, toPercent } from '../shared/utils/numberFormat'

const useStyles = makeStyles(theme => ({
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
  companyName: {
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

const IndexETF = ({ quote, data }) => {
  const classes = useStyles()

  return (
    <Paper
      component={Link}
      // to={`/company/${quote.symbol}`}
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
          {quote.symbol}
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
        </Typography>
      </div>
      <Typography variant='caption' className={classes.companyName}>
        {quote.companyName}
      </Typography>
      <div className={classes.sparklineWrapper}>
        <Sparkline data={data} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography className={classes.latestPrice} component='div' variant='h5'>
          {toCurrency(quote.latestPrice)}
        </Typography>
      </div>
    </Paper>
  )
}

export default IndexETF
