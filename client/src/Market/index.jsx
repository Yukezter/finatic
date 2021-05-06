import React from 'react'
import _ from 'lodash'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

import ArrowIcon from '../shared/components/ArrowIcon'
import BtcIcon from '../shared/assets/icons/btc_black.svg'
import EthIcon from '../shared/assets/icons/eth_black.svg'
import LtcIcon from '../shared/assets/icons/ltc_black.svg'
import EurIcon from '../shared/assets/icons/eur_black.svg'
import GbpIcon from '../shared/assets/icons/gbp_black.svg'
import JpyIcon from '../shared/assets/icons/jpy_black.svg'
import Table from './ReactTable'
import Doughnut from './Doughnut'
import api from '../shared/hooks/api'
import { toPercent } from '../shared/utils/numberFormat'

const useStyles = makeStyles(({ spacing, palette, breakpoints, typography }) => ({
  root: {},
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tab: {
    opacity: 1,
    minHeight: 'auto',
    height: spacing(4),
    minWidth: 'auto',
    padding: 0,
    paddingLeft: spacing(0.5),
    paddingRight: spacing(0.5),
    color: palette.text.secondary,
    fontWeight: 800,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: spacing(3),
    textTransform: 'capitalize',
    '&:hover': {
      color: palette.primary.main,
    },
    '&.active': {
      backgroundColor: 'rgba(253, 198, 0, 0.2)',
      color: palette.primary.main,

      '&:hover': {
        color: palette.primary.main,
      },
    },
    [breakpoints.up('xs')]: {
      '&.active': {
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
      },
      fontSize: typography.body1.fontSize,
    },
    [breakpoints.up('sm')]: {
      fontSize: typography.body1.fontSize,
    },
  },
  paper: {
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: 'rgba(0, 0, 0, 0.23)',
    borderColor: palette.common.black,
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
  },
  subheader: {
    fontSize: typography.body1.fontSize,
    fontFamily: typography.fontFamily,
    fontWeight: 800,
    // color: 'rgba(0, 0, 0, 0.54)',
  },
  listItem: {
    '& div': {
      '&:first-child': {
        '& > span': {
          fontWeight: 600,
        },
      },
      '&:last-child': {
        textAlign: 'right',
      },
    },
  },
  avatar: {
    height: 'auto',
    width: 'auto',
    marginRight: spacing(1),
  },
  avatarImg: {
    width: spacing(3),
    height: spacing(3),
  },
}))

const TabPanel = ({ value, type, index, children, ...rest }) => (
  <div
    role='tabpanel'
    hidden={value !== type}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    style={{ display: value !== type ? 'none' : 'initial' }}
    {...rest}
  >
    {value === type && <div>{children}</div>}
  </div>
)

const a11yProps = index => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
})

let renders = 0

const Market = () => {
  console.log('Market renders:', ++renders)

  const classes = useStyles()

  const [listType, setListType] = React.useState('mostactive')
  const handleTab = index => () => setListType(index)

  const { data, isLoading } = api.get(`/market/list/${listType}`, {
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    onError: error => console.log(error),
  })

  const renderTabs = (
    <div aria-label='Table data tabs'>
      {[
        {
          type: 'mostactive',
          label: 'Trending',
        },
        {
          type: 'gainers',
          label: 'Gainers',
        },
        {
          type: 'losers',
          label: 'Losers',
        },
      ].map(({ type, label }, index) => (
        <Tab
          key={index}
          className={clsx(listType === type && 'active')}
          classes={{ root: classes.tab }}
          label={label}
          onClick={handleTab(type)}
          {...a11yProps(index)}
        />
      ))}
    </div>
  )

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {renderTabs}
          <TabPanel value={listType} index={0} type='mostactive'>
            <Paper className='paper' elevation={0}>
              <Table data={data} isLoading={isLoading} />
            </Paper>
          </TabPanel>
          <TabPanel value={listType} index={1} type='gainers'>
            <Paper className='paper' elevation={0}>
              <Table data={data} isLoading={isLoading} />
            </Paper>
          </TabPanel>
          <TabPanel value={listType} index={2} type='losers'>
            <Paper className='paper' elevation={0}>
              <Table data={data} isLoading={isLoading} />
            </Paper>
          </TabPanel>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={12}>
              <Paper className={classes.paper} elevation={0}>
                <List
                  aria-labelledby='sector performance'
                  subheader={
                    <ListSubheader
                      className={classes.subheader}
                      id='sector performance'
                      disableGutters
                    >
                      Sector Performance
                    </ListSubheader>
                  }
                >
                  {_.shuffle([
                    {
                      type: 'sector',
                      name: 'Materials',
                      performance: 0.01092,
                      lastUpdated: 1620158400014,
                    },
                    {
                      type: 'sector',
                      name: 'Financials',
                      performance: 0.00796,
                      lastUpdated: 1620158400048,
                    },
                    {
                      type: 'sector',
                      name: 'Industrials',
                      performance: 0.00437,
                      lastUpdated: 1620158400028,
                    },
                    {
                      type: 'sector',
                      name: 'Health Care',
                      performance: 0.00106,
                      lastUpdated: 1620158400043,
                    },
                    {
                      type: 'sector',
                      name: 'Energy',
                      performance: 0.00059,
                      lastUpdated: 1620158400051,
                    },
                    {
                      type: 'sector',
                      name: 'Utilities',
                      performance: -0.00375,
                      lastUpdated: 1620158400042,
                    },
                    {
                      type: 'sector',
                      name: 'Consumer Staples',
                      performance: -0.00513,
                      lastUpdated: 1620158400038,
                    },
                    {
                      type: 'sector',
                      name: 'Real Estate',
                      performance: -0.00611,
                      lastUpdated: 1620158400262,
                    },
                    {
                      type: 'sector',
                      name: 'Communication Services',
                      performance: -0.00902,
                      lastUpdated: 1620158400224,
                    },
                    {
                      type: 'sector',
                      name: 'Consumer Discretionary',
                      performance: -0.01045,
                      lastUpdated: 1620158400042,
                    },
                    {
                      type: 'sector',
                      name: 'Technology',
                      performance: -0.01795,
                      lastUpdated: 1620158400045,
                    },
                  ]).map(({ name, performance }) => (
                    <ListItem key={name} dense disableGutters>
                      <ListItemText
                        style={{
                          margin: 0,
                          paddingRight: 4,
                          // overflow: 'hidden',
                          // whiteSpace: 'nowrap',
                          // textOverflow: 'ellipsis',
                        }}
                        disableTypography
                        primary={
                          <Typography
                            variant='body2'
                            color='textSecondary'
                            style={
                              {
                                // overflow: 'hidden',
                                // whiteSpace: 'nowrap',
                                // textOverflow: 'ellipsis',
                              }
                            }
                          >
                            {name}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: '0 0 auto', margin: 0 }}
                        disableTypography
                        primary={
                          <Typography
                            variant='body2'
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {toPercent(performance)}
                            <ArrowIcon
                              up={performance >= 0}
                              style={{ marginLeft: 8 }}
                            />
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={12}>
              <Paper className={classes.paper} elevation={0}>
                <List
                  className={classes.list}
                  aria-labelledby='cryptocurrency prices'
                  subheader={
                    <ListSubheader
                      className={classes.subheader}
                      id='cryptocurrency prices'
                      disableGutters
                    >
                      Cryptocurrencies
                    </ListSubheader>
                  }
                >
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='Bitcoin'
                      src={BtcIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='Bitcoin' />
                    <ListItemText primary='$50,342.21' />
                  </ListItem>
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='Ethereum'
                      src={EthIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='Ethereum' />
                    <ListItemText primary='$2,271.30' />
                  </ListItem>
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='Litecoin'
                      src={LtcIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='Litecoin' />
                    <ListItemText primary='$229.93' />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Paper className={classes.paper} elevation={0}>
                <List
                  className={classes.list}
                  aria-labelledby='US Dollar Exchange Rate'
                  subheader={
                    <ListSubheader
                      className={classes.subheader}
                      id='US Dollar Exchange Rate'
                      disableGutters
                    >
                      USD Exchange Rate
                    </ListSubheader>
                  }
                >
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='Euro'
                      src={EurIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='EUR/USD' />
                    <ListItemText primary='1.2101' />
                  </ListItem>
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='British Pound'
                      src={GbpIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='GBP/USD' />
                    <ListItemText primary='1.3879' />
                  </ListItem>
                  <ListItem className={classes.listItem} dense disableGutters>
                    <Avatar
                      alt='Japanese Yen'
                      src={JpyIcon}
                      classes={{
                        root: classes.avatar,
                        img: classes.avatarImg,
                      }}
                    />
                    <ListItemText primary='USD/JPY' />
                    <ListItemText primary='107.8650' />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Doughnut percentage={25.78} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default Market
