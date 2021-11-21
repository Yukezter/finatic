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
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

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

const Root = styled('div')(({ theme }) => ({
  width: '100%',

  [`& .${classes.link}`]: {
    textDecoration: 'none',
  },

  [`& .${classes.statsListItemText}`]: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

const Stats = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/stats`,
    cacheTime: 1000 * 30,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    select: data => [
      abbreviate(data.marketcap, '-'),
      group(data.week52high, '-'),
      group(data.week52low, '-'),
      group(data.week52change, '-'),
      abbreviate(data.sharesOutstanding, '-'),
      group(data.peRatio, '-'),
      percent(data.dividendYield, '-'),
      group(data.beta, '-'),
      abbreviate(data.avg10Volume, '-'),
      abbreviate(data.avg30Volume, '-'),
      group(data.ttmEPS, '-'),
      group(data.ttmDividendRate, '-'),
      group(data.day200MovingAvg, '-'),
      group(data.day50MovingAvg, '-'),
      percent(data.year5ChangePercent, '-'),
      percent(data.maxChangePercent, '-'),
    ],
  })

  return (
    <div>
      <Typography variant='h5' component='h4' paragraph>
        Stats
      </Typography>
      <Grid
        component={List}
        // dense
        container
        rowSpacing={0}
        columnSpacing={{ xs: 4, sm: 2 }}
      >
        {[
          'Market cap',
          '52 Wk High',
          '52 Wk Low',
          '52 Wk Change',
          'Shares',
          'P/E Ratio',
          'Div/Yield',
          'Beta',
          'Avg 10D Vol',
          'Avg 30D Vol',
          'TTM EPS',
          'TTM Div Rate',
          '200 MDA',
          '50 MDA',
          '5Y Change',
          'Max Change',
        ].map((name: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid key={index} component={ListItem} disablePadding item xs={6}>
            <Container maxWidth={false} disableGutters>
              <ListItemText
                className={classes.statsListItemText}
                primary={name}
                primaryTypographyProps={{
                  noWrap: true,
                  color: 'textSecondary',
                  style: { marginRight: 16 },
                }}
                secondary={!isSuccess ? <Skeleton width='100%' /> : data[index]}
                secondaryTypographyProps={{
                  color: 'textPrimary',
                }}
              />
            </Container>
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

const maxLength = 300

const About = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/company`,
    cacheTime: 1000 * 30,
  })

  const [showMore, setShowMore] = React.useState(false)

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
            secondary={!isSuccess ? <Skeleton width={60} /> : data.CEO || '-'}
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ListItemText
            style={{ display: 'flex', justifyContent: 'space-between' }}
            primary='Employees'
            primaryTypographyProps={{
              color: 'textSecondary',
            }}
            secondary={!isSuccess ? <Skeleton width={60} /> : group(data.employees, '-')}
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
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
                <Skeleton width={100} />
              ) : (
                displayHeadquarters(data.city, data.state, data.country)
              )
            }
            secondaryTypographyProps={{
              color: 'textPrimary',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1' component='p' paragraph>
            {!isSuccess ? (
              <>
                <Skeleton width='100%' />
                <Skeleton width='100%' />
                <Skeleton width='80%' />
              </>
            ) : data.description.length > maxLength && !showMore ? (
              `${data.description.slice(0, maxLength - 3)}...`
            ) : (
              data.description
            )}
          </Typography>
          {isSuccess && data.description.length > maxLength && (
            <Box width='100%' display='flex' justifyContent='center'>
              <Button
                size='small'
                variant='text'
                color='primary'
                onClick={() => setShowMore(prev => !prev)}
              >
                Show {!showMore ? 'More' : 'Less'}
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

const News = ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<any, Error>(`/stock/${symbol}/news`)

  return (
    <section>
      {/* <Typography variant='h5' component='h4' gutterBottom>
        News
      </Typography> */}
      <List dense>
        {!isSuccess
          ? Array.from(Array(8)).map((_, index) => (
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
              <ListItem
                key={article.url}
                disablePadding
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
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
                <Typography variant='body2' component='p' color='textSecondary' paragraph>
                  {article.summary.length > 80
                    ? `${article.summary.slice(0, 77)}...`
                    : article.summary}
                </Typography>
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
    console.log(symbol)
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
