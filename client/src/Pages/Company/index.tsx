/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { useQuery } from 'react-query'
import { Theme } from '@mui/material'
// import createStyles from '@mui/styles/createStyles';
// import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'

import { group, abbreviate, percent } from '../../Utils/numberFormats'
import { GlobalContext } from '../../Context/Global'
import { Button, Link } from '../../Components'
import PriceDisplayAndChart from './PriceDisplayAndChart'
import EarningsChart from './EarningsChart'
import Related from './Related'

const PREFIX = 'index'

const classes = {
  link: `${PREFIX}-link`,
  statsListItemText: `${PREFIX}-statsListItemText`,
  article: `${PREFIX}-article`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  width: '100%',
  // paddingTop: theme.spacing(8),

  [`& .${classes.link}`]: {
    textDecoration: 'none',
  },

  [`& .${classes.statsListItemText}`]: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
}))

const Stats = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/stats`,
    cacheTime: 1000 * 30,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    select: data => [
      {
        name: 'Market cap',
        value: abbreviate(data.marketcap, '-'),
      },
      {
        name: '52 Wk High',
        value: group(data.week52high, '-'),
      },
      {
        name: '52 Wk Low',
        value: group(data.week52low, '-'),
      },
      {
        name: '52 Wk Change',
        value: group(data.week52change, '-'),
      },
      {
        name: 'Shares',
        value: abbreviate(data.sharesOutstanding, '-'),
      },
      {
        name: 'P/E Ratio',
        value: group(data.peRatio, '-'),
      },
      {
        name: 'Div/Yield',
        value: percent(data.dividendYield, '-'),
      },
      {
        name: 'Beta',
        value: group(data.beta, '-'),
      },
      {
        name: 'Avg 10D Vol',
        value: abbreviate(data.avg10Volume, '-'),
      },
      {
        name: 'Avg 30D Vol',
        value: abbreviate(data.avg30Volume, '-'),
      },
      {
        name: 'TTM EPS',
        value: group(data.ttmEPS, '-'),
      },
      {
        name: 'TTM Div Rate',
        value: group(data.ttmDividendRate, '-'),
      },
      {
        name: '200 MDA',
        value: group(data.day200MovingAvg, '-'),
      },
      {
        name: '50 MDA',
        value: group(data.day50MovingAvg, '-'),
      },
      {
        name: '5Y Change',
        value: percent(data.year5ChangePercent, '-'),
      },
      {
        name: 'Max Change',
        value: percent(data.maxChangePercent, '-'),
      },
    ],
  })

  return (
    <div>
      <Typography variant='h5' component='h4' paragraph>
        Stats
      </Typography>
      <Grid
        component={List}
        dense
        container
        rowSpacing={{ xs: 0.5, sm: 0 }}
        columnSpacing={{ xs: 4, sm: 2 }}
      >
        {(!isSuccess ? Array.from(Array(16)) : data).map((stat: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid key={index} component={ListItem} disableGutters item xs={6} sm={3}>
            <>
              {!isSuccess ? (
                <Skeleton width='100%' />
              ) : (
                <ListItemText
                  className={classes.statsListItemText}
                  primary={stat.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    color: 'textSecondary',
                    style: {
                      marginRight: 16,
                    },
                  }}
                  secondary={stat.value}
                  secondaryTypographyProps={{
                    color: 'textPrimary',
                  }}
                />
              )}
            </>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

const displayHeadquarters = (
  city: string | undefined,
  state: string | undefined,
  country: string | undefined
): string => {
  let address = ''
  if (city && state) {
    address += `${city}, ${state}`
  } else if (country) {
    address = country
  } else {
    address = '-'
  }

  return address
}

const maxLength = 400

const About = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/company`,
    cacheTime: 1000 * 30,
  })

  const [readMore, setReadMore] = React.useState(false)

  return (
    <div>
      <Typography variant='h5' component='h4' paragraph>
        {!isSuccess ? <Skeleton width='20%' /> : `About ${data.companyName}`}
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={4} marginBottom={2}>
        <Grid item xs={12} sm={6}>
          <ListItemText
            style={{ display: 'flex', justifyContent: 'space-between' }}
            primary='CEO'
            primaryTypographyProps={{
              color: 'textSecondary',
            }}
            secondary={!isSuccess ? <Skeleton width={30} /> : data.CEO || '-'}
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
          {/* <Divider /> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          <ListItemText
            style={{ display: 'flex', justifyContent: 'space-between' }}
            primary='Employees'
            primaryTypographyProps={{
              color: 'textSecondary',
            }}
            secondary={!isSuccess ? <Skeleton width={30} /> : group(data.employees, '-')}
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
          {/* <Divider /> */}
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            style={{ display: 'flex', justifyContent: 'space-between' }}
            primary='Headquarters'
            primaryTypographyProps={{
              color: 'textSecondary',
            }}
            secondary={
              !isSuccess ? (
                <Skeleton width={60} />
              ) : (
                displayHeadquarters(data.city, data.state, data.country)
              )
            }
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
          {/* <Divider /> */}
        </Grid>
      </Grid>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='body1' component='p' paragraph>
          {!isSuccess ? (
            <>
              <Skeleton width='100%' />
              <Skeleton width='100%' />
              <Skeleton width='80%' />
            </>
          ) : data.description.length > maxLength && !readMore ? (
            `${data.description.slice(0, maxLength - 3)}...`
          ) : (
            data.description
          )}
        </Typography>
        {isSuccess && data.description.length > maxLength && (
          <Button variant='outlined' onClick={() => setReadMore(prev => !prev)}>
            Read More
          </Button>
        )}
      </div>
    </div>
  )
}

const News = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>(`/stock/${symbol}/news`)

  return (
    <section>
      <Typography variant='h5' component='h4' gutterBottom>
        News
      </Typography>
      <List dense>
        {!isSuccess
          ? Array.from(Array(5)).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={index} disablePadding>
                <ListItemText
                  primary={<Skeleton width='100%' />}
                  primaryTypographyProps={{
                    variant: 'h6',
                  }}
                  secondary={
                    <>
                      <Skeleton width='100%' />
                      <Skeleton width='40%' />
                    </>
                  }
                />
              </ListItem>
            ))
          : data.map((article: any) => (
              <ListItem key={article.url} className={classes.article} disablePadding>
                <ListItemText
                  disableTypography
                  primary={
                    <Link
                      variant='h6'
                      href={article.url}
                      sx={{
                        mb: 1,
                        ':hover': {
                          textDecorationColor: theme => theme.palette.primary.main,
                        },
                      }}
                    >
                      {article.headline}
                    </Link>
                  }
                  secondary={
                    <Typography
                      variant='body2'
                      component='p'
                      color='textSecondary'
                      gutterBottom
                    >
                      {article.summary.length > 125
                        ? `${article.summary.slice(0, 122)}...`
                        : article.summary}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
      </List>
    </section>
  )
}

export default ({ theme }: { theme: Theme }) => {
  const globalState = React.useContext(GlobalContext)
  const { refSymbolsMap } = globalState
  const { symbol }: { symbol: string } = useParams()

  if (!refSymbolsMap.has(symbol)) {
    return <Redirect to='/404' />
  }

  return (
    <Root>
      <Grid container rowSpacing={{ xs: 2, sm: 4 }} columnSpacing={{ md: 8 }}>
        <Grid container item xs={12} lg={8} rowSpacing={{ xs: 2, sm: 4 }}>
          <Grid item xs={12}>
            <Typography variant='h2' component='h1' style={{ lineHeight: 1 }}>
              {symbol}
            </Typography>
            <PriceDisplayAndChart globalState={globalState} theme={theme} symbol={symbol} />
          </Grid>
          <Grid item xs={12}>
            <About symbol={symbol} />
          </Grid>
          <Grid item xs={12}>
            <Stats symbol={symbol} />
          </Grid>
          <Grid item xs={12}>
            <EarningsChart symbol={symbol} theme={theme} />
          </Grid>
          <Grid item xs={12}>
            <Related globalState={globalState} symbol={symbol} />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <News symbol={symbol} />
        </Grid>
      </Grid>
    </Root>
  )
}
