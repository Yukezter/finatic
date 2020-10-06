import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import api from '../shared/hooks/api'
import * as number from '../shared/utils/number'

import useStyles from './styles'

const Market = () => {
  console.log('Market rendered')
  const classes = useStyles()

  const { data, isLoading, isError } = api.get('/market', {
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  const { mostActive, sectorPerformance, dataPoints } = data

  return (
    <Container className={classes.root} maxWidth='lg'>
      <Box pt={3} mb={3}>
        <Typography variant='h3' component='h1' display='inline'>
          Market
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}></Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant='h6' component='h2'>
            Sector Performance
          </Typography>
          <List className='sector-performance-list'>
            {sectorPerformance.map(({ name, performance }) => (
              <ListItem key={name} disableGutters>
                <Typography variant='body2' component='p'>
                  {name}
                </Typography>
                <Typography variant='body2' component='p'>
                  {number.percent(performance)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant='h6' component='h2'>
            Economy
          </Typography>
          <List className='economy-list'>
            {dataPoints.economy.map(({ description, data }) => (
              <ListItem key={description} disableGutters>
                <Typography variant='body2' component='p'>
                  {description}
                </Typography>
                <Typography variant='body2' component='p'>
                  {data}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant='h6' component='h2'>
            Treasuries
          </Typography>
          <List className='treasuries-list'>
            {dataPoints.treasuries.map(({ description, data }) => (
              <ListItem key={description} disableGutters>
                <Typography variant='body2' component='p'>
                  {description}
                </Typography>
                <Typography variant='body2' component='p'>
                  {data}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant='h6' component='h2'>
            Commodities
          </Typography>
          <List className='commodities-list'>
            {dataPoints.commodities.map(({ description, data }) => (
              <ListItem key={description} disableGutters>
                <Typography variant='body2' component='p'>
                  {description}
                </Typography>
                <Typography variant='body2' component='p'>
                  {data}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Market
