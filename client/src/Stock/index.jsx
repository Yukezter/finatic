import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import Chart from './Chart'

import { toGrouped, toSuffixed, toFixed, toCurrency, toPercent } from '../shared/utils/numberFormat'

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
      '& > span:first-child': {
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

const Stat = ({ isLoading, title, data }) => {
  return (
    <ListItem disableGutters>
      <div>
        <Typography className='label' variant='caption' component='p' noWrap gutterBottom>
          {title}
        </Typography>
        <Typography className='value' variant='caption' component='p' noWrap>
          {isLoading ? <Skeleton width={50} /> : data === null ? 'N/A' : data}
        </Typography>
      </div>
    </ListItem>
  )
}

const Stats = ({ classes, symbol }) => {
  const { isPlaceholderData, data } = useQuery(`/stock/${symbol}/stats`, { placeholderData: {} })

  return (
    <div className={classes.stats}>
      <List>
        <Stat isLoading={isPlaceholderData} title='Employees' data={toGrouped(data.employees)} />
        <Stat isLoading={isPlaceholderData} title='Market cap' data={toSuffixed(data.marketcap)} />
        <Stat isLoading={isPlaceholderData} title='Float' data={toSuffixed(data.float)} />
        <Stat isLoading={isPlaceholderData} title='Avg 10d volume' data={toSuffixed(data.avg10Volume)} />
        <Stat isLoading={isPlaceholderData} title='Avg 30d volume' data={toSuffixed(data.avg30Volume)} />
        <Stat isLoading={isPlaceholderData} title='P/E ratio' data={toFixed(data.peRatio)} />
        <Stat isLoading={isPlaceholderData} title='Beta' data={toFixed(data.beta)} />
        <Stat isLoading={isPlaceholderData} title='TTM EPS' data={toFixed(data.ttmEPS)} />
        <Stat isLoading={isPlaceholderData} title='Div/Yield' data={toPercent(data.dividendYield)} />
        <Stat isLoading={isPlaceholderData} title='52 week high' data={toCurrency(data.week52high)} />
        <Stat isLoading={isPlaceholderData} title='52 week low' data={toCurrency(data.week52low)} />
        <Stat isLoading={isPlaceholderData} title='52 week change' data={toPercent(data.week52change)} />
        <Stat isLoading={isPlaceholderData} title='200 MDA' data={data.day200MovingAvg} />
        <Stat isLoading={isPlaceholderData} title='50 MDA' data={data.day50MovingAvg} />
      </List>
    </div>
  )
}

const Company = ({ classes, symbol }) => {
  const { isLoading, data } = useQuery(`/stock/${symbol}/company`)

  return (
    <div className={classes.company}>
      <Typography variant='h5' component='h2' gutterBottom>
        {isLoading ? <Skeleton width='35%' /> : `About ${data.companyName}`}
      </Typography>
      <Typography className='description' variant='body2' component='p' gutterBottom>
        {isLoading ? (
          <>
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='60%' />
          </>
        ) : (
          data.description || 'N/A'
        )}
      </Typography>
      <Typography className='CEO' variant='body2' component='p' gutterBottom>
        {isLoading ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>CEO</span>
            <span>{data.CEO || 'N/A'}</span>
          </>
        )}
      </Typography>
      <Typography className='headquarters' variant='body2' component='p' gutterBottom>
        {isLoading ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>Headquarters</span>
            <span>{`${data.city || 'N/A'}, ${data.state || 'N/A'}`}</span>
          </>
        )}
      </Typography>
      <Typography className='employees' variant='body2' component='p' gutterBottom>
        {isLoading ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>Employees</span>
            <span>{toGrouped(data.employees) || 'N/A'}</span>
          </>
        )}
      </Typography>
    </div>
  )
}

const Article = ({ classes, isLoading, data: { url, headline, datetime } }) => (
  <div className={classes.article}>
    <Typography className='headline' variant='body1' component='h3' gutterBottom>
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton width='60%' />
        </>
      ) : (
        <a href={url} target='_blank' className='image' rel='noopener noreferrer'>
          {headline}
        </a>
      )}
    </Typography>
    <Typography className='datetime' variant='caption' component='p' gutterBottom>
      {isLoading ? <Skeleton width='30%' /> : new Date(datetime).toDateString()}
    </Typography>
  </div>
)

const News = ({ classes, symbol }) => {
  const { isPlaceholderData, data } = useQuery(`/stock/${symbol}/news`, {
    placeholderData: new Array(10).fill({}),
  })

  return data.map((article, idx) => (
    <Article key={idx} classes={classes} isLoading={isPlaceholderData} data={article} />
  ))
}

const Stock = ({ theme }) => {
  const classes = useStyles()
  const { symbol } = useParams()

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Typography className={classes.symbol} variant='h3' component='h1'>
            {symbol}
          </Typography>
          <Chart key={symbol} theme={theme} symbol={symbol} />
          <Stats classes={classes} symbol={symbol} />
          <Company classes={classes} symbol={symbol} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <News classes={classes} symbol={symbol} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Stock
