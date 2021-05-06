import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
// import Container from '@material-ui/core/Container'

import Table from './Table'

const useStyles = makeStyles(({ spacing, palette, breakpoints, typography }) => ({
  root: {},
  topTabs: {
    [breakpoints.up('md')]: {
      display: 'none',
    },
  },
  tabs: {
    display: 'flex',
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    [breakpoints.up('md')]: {
      position: 'fixed',
      flexDirection: 'column',
      // marginLeft: spacing(1),
    },
  },
  tab: {
    opacity: 1,
    minHeight: 'auto',
    minWidth: 'auto',
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    marginRight: spacing(0.5),
    color: palette.text.secondary,
    fontWeight: 800,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: spacing(3.75),
    '&:hover': {
      color: palette.primary.main,
    },
    '&.active': {
      borderColor: palette.primary.main,
      color: palette.primary.main,
      '&:hover': {
        color: palette.primary.main,
      },
    },
    [breakpoints.up('md')]: {
      fontSize: typography.body1.fontSize,
      paddingLeft: spacing(2.5),
      paddingRight: spacing(2.5),
    },
    [breakpoints.up('lg')]: {
      paddingLeft: spacing(8),
      paddingRight: spacing(8),
    },
  },
  paper: {
    marginBottom: spacing(5),
  },
  sideColumn: {
    display: 'none',
    '& > div': {
      marginLeft: spacing(2),
    },
    [breakpoints.up('md')]: {
      display: 'block',
    },
    [breakpoints.up('lg')]: {
      '& > div': {
        marginLeft: spacing(3),
      },
    },
    [breakpoints.up('lg')]: {
      '& > div': {
        marginLeft: spacing(5),
      },
    },
  },
}))

const TabPanel = ({ value, index, children, ...rest }) => (
  <div
    role='tabpanel'
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    style={{ display: value !== index ? 'none' : 'initial' }}
    {...rest}
  >
    {value === index && <div>{children}</div>}
  </div>
)

const a11yProps = index => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
})

const Tabs = ({ theme, topLists }) => {
  const classes = useStyles()
  const [tab, setTab] = React.useState(0)
  const handleTab = index => () => setTab(index)

  const renderTabs = (
    <div aria-label='Table data tabs'>
      <div className={classes.tabs}>
        {['Trending', 'Gainers', 'Losers', 'Earnings'].map((label, index) => (
          <div key={index}>
            <Tab
              className={clsx(tab === index && 'active')}
              classes={{ root: classes.tab }}
              label={label}
              onClick={handleTab(index)}
              {...a11yProps(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} md={10} lg={9}>
        <div className={classes.topTabs}>{renderTabs}</div>
        <TabPanel value={tab} index={0}>
          <Paper className={classes.paper} elevation={0}>
            <Table theme={theme} rows={topLists[0]} />
          </Paper>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Paper className={classes.paper} elevation={0}>
            <Table theme={theme} rows={topLists[1]} />
          </Paper>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Paper className={classes.paper} elevation={0}>
            <Table theme={theme} rows={topLists[2]} />
          </Paper>
        </TabPanel>
      </Grid>
      <Grid className={classes.sideColumn} item md={2} lg={3}>
        <div>{renderTabs}</div>
      </Grid>
    </Grid>
  )
}

export default Tabs
