import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/lab/Skeleton'

import Link from '../shared/components/Link'
import Button from '../shared/components/Button'
import PriceChart from './PriceChart'
import RatingsChart from './RatingsChart'

import { toGrouped, toSuffixed, toFixed, toCurrency, toPercent } from '../shared/utils/numberFormat'

const useStyles = makeStyles(({ spacing, palette, typography, breakpoints }) => ({
  root: {
    '& h2': {
      fontWeight: 600,
    },
  },
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
      '& > ul > li': {
        '& .label, & .value': {
          fontSize: typography.body2.fontSize,
        },
      },
    },
  },
  company: {
    marginBottom: spacing(2),

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
  description: {
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    maxHeight: 120,
    pointerEvents: 'none',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      height: '100%',
      width: '100%',
      background: `linear-gradient(to bottom, transparent 0%, ${fade(
        palette.background.default,
        0.6,
      )} 30%, ${fade(palette.background.default, 1)} 60%)`,
    },
  },
  descriptionExpanded: {
    maxHeight: 'inherit',
    paddingBottom: spacing(4.5),
    '&:after': {
      background: 'none',
    },
  },
  showMore: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: '0 auto',
    borderRadius: spacing(0.5),
    background: palette.background.default,
  },
  news: {
    marginBottom: spacing(4),
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
    '&:hover > .headline > a': {
      textDecoration: 'underline',
      textDecorationColor: palette.primary.main,
    },
    '& > .datetime': {
      color: palette.grey[500],
    },
  },
  chipSkeleton: {
    marginRight: spacing(1),
    marginBottom: spacing(1),
  },
  chip: {
    marginRight: spacing(1),
    marginBottom: spacing(1),
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
          {isLoading ? <Skeleton width={50} /> : data === null ? ' - ' : data}
        </Typography>
      </div>
    </ListItem>
  )
}

const Stats = ({ classes, symbol }) => {
  const { isPlaceholderData, isError, data } = useQuery(`/stock/${symbol}/stats`, { placeholderData: {} })
  const isLoading = isPlaceholderData || isError

  return (
    <div className={classes.stats}>
      <List dense>
        <Stat isLoading={isLoading} title='Market cap' data={toSuffixed(data.marketcap)} />
        <Stat isLoading={isLoading} title='52 wk high' data={toCurrency(data.week52high)} />
        <Stat isLoading={isLoading} title='52 wk low' data={toCurrency(data.week52low)} />
        <Stat isLoading={isLoading} title='52 wk change' data={toPercent(data.week52change)} />
        <Stat isLoading={isLoading} title='Shares outstanding' data={toSuffixed(data.sharesOutstanding)} />
        <Stat isLoading={isLoading} title='P/E ratio' data={toFixed(data.peRatio)} />
        <Stat isLoading={isLoading} title='Div/Yield' data={toPercent(data.dividendYield)} />
        <Stat isLoading={isLoading} title='Beta' data={toFixed(data.beta)} />
        <Stat isLoading={isLoading} title='Avg 10d vol' data={toSuffixed(data.avg10Volume)} />
        <Stat isLoading={isLoading} title='Avg 30d vol' data={toSuffixed(data.avg30Volume)} />
        <Stat isLoading={isLoading} title='TTM EPS' data={toFixed(data.ttmEPS)} />
        <Stat isLoading={isLoading} title='TTM Dividend Rate' data={toFixed(data.ttmDividendRate)} />
        <Stat isLoading={isLoading} title='200 MDA' data={toFixed(data.day200MovingAvg)} />
        <Stat isLoading={isLoading} title='50 MDA' data={toFixed(data.day50MovingAvg)} />
        <Stat isLoading={isLoading} title='5Y Change' data={toPercent(data.year5ChangePercent)} />
        <Stat isLoading={isLoading} title='Max Change' data={toPercent(data.maxChangePercent)} />
      </List>
    </div>
  )
}

const Description = ({ classes, data }) => {
  const [expanded, setExpanded] = useState(false)

  const handleClick = () => {
    setExpanded(prevState => !prevState)
  }

  return (
    <div style={{ position: 'relative' }}>
      {data.length > 400 ? (
        <>
          <span className={clsx(classes.description, expanded && classes.descriptionExpanded)}>{data}</span>
          <Button size='small' variant='outlined' className={classes.showMore} onClick={handleClick}>
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </>
      ) : (
        data
      )}
    </div>
  )
}

const Company = ({ classes, symbol }) => {
  const { isLoading, isError, data } = useQuery(`/stock/${symbol}/company`)

  return (
    <div className={classes.company}>
      <Typography variant='h5' component='h2' paragraph>
        {isLoading || isError ? <Skeleton width='35%' /> : `About ${data.companyName}`}
      </Typography>
      <Typography className='description' variant='body2' component='p' gutterBottom>
        {isLoading || isError ? (
          <>
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='60%' />
          </>
        ) : (
          data.description && <Description classes={classes} data={data.description} />
        )}
      </Typography>
      <Typography className='CEO' variant='body2' component='p' gutterBottom>
        {isLoading || isError ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>CEO</span>
            <span>{data.CEO || ' - '}</span>
          </>
        )}
      </Typography>
      <Typography className='headquarters' variant='body2' component='p' gutterBottom>
        {isLoading || isError ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>Headquarters</span>
            <span>{data.state || data.city ? `${data.city && `${data.city},`} ${data.state}` : ' - '}</span>
          </>
        )}
      </Typography>
      <Typography className='employees' variant='body2' component='p' gutterBottom>
        {isLoading || isError ? (
          <Skeleton width='100%' />
        ) : (
          <>
            <span>Employees</span>
            <span>{toGrouped(data.employees) || ' - '}</span>
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
      {isLoading ? <Skeleton width='30%' /> : headline && new Date(datetime).toDateString()}
    </Typography>
  </div>
)

const News = ({ classes, symbol }) => {
  const placeholderData = new Array(6).fill({})
  const { isPlaceholderData, isError, data } = useQuery(`/stock/${symbol}/news/last/10?language=en`, {
    placeholderData,
  })

  return (
    <div className={classes.news}>
      <Typography variant='h5' component='h2' paragraph>
        News
      </Typography>
      {(isError ? placeholderData : data).map((article, idx) => (
        <Article key={idx} classes={classes} isLoading={isPlaceholderData || isError} data={article} />
      ))}
    </div>
  )
}

const Peers = ({ classes, symbol }) => {
  const { isLoading, isError, data } = useQuery(`/stock/${symbol}/peers`)

  return (
    <div>
      <Typography variant='h5' component='h2' paragraph>
        Related Stonks
      </Typography>
      {isLoading || isError ? (
        <>
          <Skeleton className={classes.chipSkeleton} component={Chip} width={16} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={30} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={10} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={40} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={30} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={56} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={34} variant='rect' />
          <Skeleton className={classes.chipSkeleton} component={Chip} width={22} variant='rect' />
        </>
      ) : (
        data.map(peer => (
          <Chip
            key={peer}
            className={classes.chip}
            label={peer}
            component={Link}
            to={`/company/${peer}`}
            clickable
          />
        ))
      )}
    </div>
  )
}

const Stock = ({ theme }) => {
  const classes = useStyles()
  const { symbol } = useParams()

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography className={classes.symbol} variant='h3' component='h1'>
            {symbol}
          </Typography>
          <PriceChart key={symbol} theme={theme} symbol={symbol} />
          <Stats classes={classes} symbol={symbol} />
          <RatingsChart theme={theme} symbol={symbol} />
          <Company classes={classes} symbol={symbol} />
        </Grid>
        <Grid item xs={12} md={4}>
          <News classes={classes} symbol={symbol} />
          <Peers classes={classes} theme={theme} symbol={symbol} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Stock
