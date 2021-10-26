/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { Theme } from '@mui/material'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
// import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { Icon } from '../../Components'
import Lists from './Lists'
import Tables from './Tables'

const PREFIX = 'Market'

const classes = {
  cards: `${PREFIX}-cards`,
  card: `${PREFIX}-card`,
  economicDataIcon: `${PREFIX}-economicDataIcon`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.economicDataIcon}`]: {
    width: 42,
    height: 42,
    display: 'flex',
    marginRight: 16,
    color: theme.palette.primary.main,
  },

  [`& .${classes.cards}`]: {
    // overflow: 'hidden',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
  },

  [`& .${classes.card}`]: {
    '& > div': {
      display: 'flex',
    },
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      // height: 160,
      // padding: theme.spacing(2.5),
      // border: `1px solid ${theme.palette.divider}`,
      // background: alpha(theme.palette.secondary.dark, 0.2),
      '& > div': {
        // height: '100%',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        // textAlign: 'center',
      },
    },
  },
}))

const economicData = [
  {
    title: 'Consumer Price Index',
    icon: 'tag',
    queryKey: '/cpi',
  },
  {
    title: 'Industrial Production Index',
    icon: 'production',
    queryKey: '/ipi',
  },
  {
    title: 'Gross Domestic Product',
    icon: 'economy',
    queryKey: '/real-gdp',
  },
  {
    title: 'Federal Fund Rates',
    icon: 'unemployment',
    queryKey: '/federal-funds',
  },
  {
    title: 'Unemployment Rate',
    icon: 'unemployment',
    queryKey: '/unemployment-rate',
  },
  {
    title: 'Recession Probability',
    icon: 'unemployment',
    queryKey: '/recession-probability',
  },
]

const EconomicData = ({ icon, title, queryKey }: any) => {
  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>(`economy/${queryKey}`)

  return (
    <ListItem divider>
      <Box color={theme => theme.palette.primary.main} flexBasis={50}>
        <Icon name={icon} height={28} width={28} />
      </Box>
      <ListItemText
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        primary={isSuccess && title}
        primaryTypographyProps={{ color: 'textSecondary' }}
        secondary={<>{!isSuccess ? <Skeleton width='80%' /> : data!.data}</>}
        secondaryTypographyProps={{ color: 'textPrimary' }}
      />
    </ListItem>
  )
}

const Market: React.FC<{ theme: Theme }> = ({ theme }: { theme: Theme }) => {
  return (
    <>
      <StyledGrid container spacing={{ lg: 8 }}>
        <Grid item xs={12} lg={8}>
          <div className={classes.cards}>
            {/* <Grid container spacing={2}>
              {economicData.map(props => (
                // eslint-disable-next-line react/prop-types
                <Grid key={props.title} item xs={6} sm={6}>
                  <EconomicData classes={classes} {...props} />
                </Grid>
              ))}
            </Grid> */}
            <List dense>
              {economicData.map(props => (
                // eslint-disable-next-line react/prop-types
                <EconomicData classes={classes} {...props} />
              ))}
            </List>
          </div>
          <Tables />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Lists theme={theme} />
        </Grid>
      </StyledGrid>
    </>
  )
}

export default Market
