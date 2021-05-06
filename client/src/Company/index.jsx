import React from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

import {
  toGrouped,
  toSuffixed,
  toFixed,
  toCurrency,
  toPercent,
} from '../shared/utils/numberFormat'
import api from '../shared/hooks/api'
import Loading from '../shared/components/Loading'

import StockChart from './StockChart'

const useStyles = makeStyles(({ spacing, palette, typography, breakpoints }) => ({
  root: {},
  symbol: {
    fontWeight: 600,
  },
  stats: {
    '& > ul': {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      '& > li': {
        width: '25%',
        '& .label': {
          color: palette.grey[500],
        },
      },
    },
    [breakpoints.up('sm')]: {
      ' > ul & > li': {
        '& .label, & .value': {
          fontSize: typography.body2.fontSize,
        },
      },
    },
  },
  company: {
    marginBottom: spacing(2),
    '& h2': {
      fontWeight: 600,
    },
    '& > .description': {
      marginBottom: spacing(2),
    },
    '& > .CEO, & > .headquarters, & > .employees': {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: spacing(0.5),
      paddingBottom: spacing(0.5),
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: 'rgba(224, 224, 224, 1)',
      '& > p:first-child': {
        fontWeight: 700,
      },
    },
  },
  article: {
    '& > .headline': {
      fontFamily: typography.fontFamily,
      fontWeight: 600,
      '& > a': {
        textDecoration: 'none',
        color: 'inherit',
      },
    },
    '& > .datetime': {
      color: palette.grey[500],
    },
  },
}))

const renderDatetime = datetime => new Date(datetime).toDateString()

let count = 0

const Company = ({ theme }) => {
  console.log('Company chart:', ++count)

  const classes = useStyles()
  const { symbol } = useParams()

  const { data, isLoading, isError, error } = api.get(`/stock/${symbol}`, {
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    console.log(error)
    return null
  }

  const {
    quote,
    stats,
    company,
    // ratings,
    // earnings,
    // estimates,
    news,
  } = data

  const statsList = [
    ['Employees', toGrouped(stats.employees)],
    ['Market cap', toSuffixed(stats.marketcap)],
    ['Float', toSuffixed(stats.float)],
    ['Volume', toSuffixed(stats.avg30Volume)],
    ['P/E ratio', toFixed(stats.peRatio)],
    ['TTM EPS', toFixed(stats.ttmEPS)],
    ['Div/Yield', toPercent(stats.dividendYield)],
    ['High', toCurrency(quote.high)],
    ['Low', toCurrency(quote.low)],
    ['Open', toCurrency(quote.open)],
    ['52 wek high', toCurrency(stats.week52high)],
    ['52 week low', toCurrency(stats.week52low)],
    ['200 MDA', stats.day200MovingAvg],
    ['50 MDA', stats.day50MovingAvg],
  ]

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Typography className={classes.symbol} variant='h3' component='h1'>
            {symbol}
          </Typography>
          <StockChart theme={theme} symbol={symbol} quote={quote} />
          <div className={classes.stats}>
            <List>
              {statsList.map(([label, stat]) => (
                <ListItem key={label} disableGutters>
                  <div>
                    <Typography
                      className='label'
                      variant='caption'
                      component='p'
                      noWrap
                      gutterBottom
                    >
                      {label}
                    </Typography>
                    <Typography
                      className='value'
                      variant='caption'
                      component='p'
                      noWrap
                    >
                      {stat === null ? 'N/A' : stat}
                    </Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.company}>
            <Typography variant='h5' component='h2' gutterBottom>
              About {quote.companyName}
            </Typography>
            <Typography
              className='description'
              variant='body2'
              component='p'
              gutterBottom
            >
              {company.description || 'N/A'}
            </Typography>
            <div className='CEO'>
              <Typography variant='body2' component='p' gutterBottom>
                CEO
              </Typography>
              <Typography variant='body2' component='p' gutterBottom>
                {company.CEO || 'N/A'}
              </Typography>
            </div>
            <div className='headquarters'>
              <Typography variant='body2' component='p' gutterBottom>
                Headquarters
              </Typography>
              <Typography variant='body2' component='p' gutterBottom>
                {company.city || 'N/A'}, {company.state || 'N/A'}
              </Typography>
            </div>
            <div className='employees'>
              <Typography variant='body2' component='p' gutterBottom>
                Employees
              </Typography>
              <Typography variant='body2' component='p' gutterBottom>
                {toGrouped(company.employees) || 'N/A'}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} lg={4}>
          {news.map(({ url, headline, datetime }) => (
            <div key={url} className={classes.article}>
              <Typography
                className='headline'
                variant='body1'
                component='h3'
                gutterBottom
              >
                <a
                  href={url}
                  target='_blank'
                  className='image'
                  rel='noopener noreferrer'
                >
                  {headline}
                </a>
              </Typography>
              <Typography
                className='datetime'
                variant='caption'
                component='p'
                gutterBottom
              >
                {renderDatetime(datetime)}
              </Typography>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

export default Company
