import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Tab from '@material-ui/core/Tab'
// import Typography from '@material-ui/core/Typography'

import IndexETF from './IndexETF'
import Table from './Table'
import SideList from './SideList'
import Doughnut from './Doughnut'

import api from '../shared/hooks/api'

const useStyles = makeStyles(({ spacing, palette, breakpoints, typography }) => ({
  root: {},
  indexETFs: {
    /* Scrollbar */
    overflowX: 'hidden',
    overflowY: 'hidden',
    scrollbarColor: `${palette.common.black} transparent`,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'black',
      borderRadius: 4,
    },
    [breakpoints.down('sm')]: {
      overflowX: 'scroll',
    },
    /* Scrollbar */

    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
    '& > div': {
      minWidth: spacing(26),
      marginRight: spacing(1),
      marginBottom: spacing(1),
    },
    [breakpoints.up('sm')]: {
      marginBottom: spacing(3),
      '& > div': {
        minWidth: 'auto',
        width: '23.5%',
        marginRight: 0,
        marginBottom: 0,
      },
    },
  },
  tab: {
    opacity: 1,
    minHeight: 'auto',
    height: spacing(4),
    minWidth: 'auto',
    padding: 0,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    color: palette.text.secondary,
    fontSize: typography.body1.fontSize,
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
  },
  sideLists: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    marginBottom: spacing(2),
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

  return (
    <div className={classes.root}>
      <div className={classes.indexETFs}>
        <div>
          <IndexETF
            quote={{
              symbol: 'SPY',
              companyName: 'SPDR S&P 500',
              latestPrice: 412.12,
              change: 1.05,
              changePercent: 0.073,
            }}
          />
        </div>
        <div>
          <IndexETF
            quote={{
              symbol: 'DIA',
              companyName: 'SPDR Dow Jones',
              latestPrice: 347.88,
              change: 2.37,
              changePercent: 0.069,
            }}
          />
        </div>
        <div>
          <IndexETF
            quote={{
              symbol: 'QQQ',
              companyName: 'Invesco NASDAQ',
              latestPrice: 334.09,
              change: 2.58,
              changePercent: 0.078,
            }}
          />
        </div>
        <div>
          <IndexETF
            quote={{
              symbol: 'IWM',
              companyName: 'iShares Russell 2000',
              latestPrice: 225.39,
              change: 2.8,
              changePercent: 0.126,
            }}
          />
        </div>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className={classes.sideLists}>
            <Grid container>
              <Grid item xs={12} sm={6} md={12}>
                <div style={{ padding: 24, paddingTop: 8, paddingBottom: 8 }}>
                  <SideList
                    ariaLabel='treasury constant maturity rates'
                    subheader='Treasury Rates'
                    list={[
                      {
                        title: '1 Year',
                        value: '0.05',
                      },
                      {
                        title: '5 Year',
                        value: '0.8',
                      },
                      {
                        title: '10 Year',
                        value: '1.63',
                      },
                    ]}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={12}>
                <div style={{ padding: 24, paddingTop: 8, paddingBottom: 8 }}>
                  <SideList
                    ariaLabel='forex'
                    subheader='USD Exchange Rate'
                    list={[
                      {
                        title: 'EUR/USD',
                        value: '1.21',
                      },
                      {
                        title: 'GBP/USD',
                        value: '1.38',
                      },
                      {
                        title: 'USD/Yen',
                        value: '107.86',
                      },
                    ]}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={12}>
                <div style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
                  <SideList
                    ariaLabel='economic data'
                    subheader='Economic Data'
                    list={[
                      {
                        title: 'CPI Urban',
                        value: '2.5',
                      },
                      {
                        title: 'Credit Card Interest Rate',
                        value: '15.1%',
                      },
                      {
                        title: 'Real GDP',
                        value: '3.7',
                      },
                    ]}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <div style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
                  <Doughnut />
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div
            style={{
              marginBottom: 32,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <SideList
                  ariaLabel='commodities'
                  subheader='Commodities'
                  list={[
                    {
                      alt: 'Crude Oil',
                      title: 'Crude Oil',
                      titleSecondary: 'West Texas Immediate',
                      value: '$55.95',
                      valueSecondary: '/barrel',
                    },
                    {
                      alt: 'Gas',
                      title: 'Gasoline',
                      titleSecondary: 'US Regular Conventional',
                      value: '$3.15',
                      valueSecondary: '/gal',
                    },
                    {
                      alt: 'Jet Fuel',
                      title: 'Jet Fuel',
                      titleSecondary: 'US Gulf Coast Kerosense',
                      value: '$2.95',
                      valueSecondary: '/gal',
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SideList
                  ariaLabel='cryptocurrencies'
                  subheader='Crypocurrencies'
                  list={[
                    {
                      title: 'BTC',
                      titleSecondary: 'Bitcoin',
                      value: '$50,342.21',
                      valueSecondary: '+9.06%',
                      performanceColor: 'green',
                    },
                    {
                      title: 'ETH',
                      titleSecondary: 'Ethereum',
                      value: '$2,271.30',
                      valueSecondary: '+12.27%',
                      performanceColor: 'green',
                    },
                    {
                      title: 'LTC',
                      titleSecondary: 'Litecoin',
                      value: '$229.93',
                      valueSecondary: '+23.54%',
                      performanceColor: 'green',
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </div>
          <div aria-label='table-data-tabs'>
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
      </Grid>
    </div>
  )
}
export default Market
