import React from 'react'
import clsx from 'clsx'
import { useTable, useSortBy } from 'react-table'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Skeleton from '@material-ui/lab/Skeleton'

import Link from '../shared/components/Link'
// import ArrowIcon from '../shared/components/ArrowIcon'

import useUnderBreakpoint from '../shared/hooks/useUnderBreakpoint'
import api from '../shared/hooks/api'
import { toCurrency, toPercent, toSuffixed } from '../shared/utils/numberFormat'

const rowHeightMobile = 48
const rowHeight = 54

const useStyles = makeStyles(({ spacing, palette, breakpoints, typography }) => ({
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
  root: {
    // overflowX: 'auto',
    '& > table': {
      width: '100%',
      borderCollapse: 'collapse',
    },
  },
  headRow: {
    '& > th': {
      height: rowHeightMobile,
      padding: 0,
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.54)',
      borderColor: 'rgba(224, 224, 224, 1)',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
    },
    '& > th:first-child': {
      paddingLeft: spacing(0.75),
    },
    '& > th.active': {
      borderBottomColor: palette.primary.main,
    },
    [breakpoints.up('md')]: {
      '& > th': {
        height: rowHeight,
      },
    },
  },
  sortLabel: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: palette.action.active,
    '&&.MuiTableSortLabel-active': {
      color: palette.primary.main,
      fontWeight: 600,
      '&& > .MuiTableSortLabel-icon': {
        color: palette.primary.main,
      },
    },
    '&:focus': {
      color: palette.action.active,
    },
    '&:hover': {
      color: palette.primary.main,
      '& > .MuiTableSortLabel-icon': {
        opacity: 0,
      },
    },
  },
  bodyRow: {
    '& > td': {
      height: rowHeightMobile,
      padding: 0,
      borderBottom: 0,
    },
    '& > td > div': {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      borderColor: 'rgba(224, 224, 224, 1)',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      paddingRight: spacing(0.75),
      paddingTop: 2,
      paddingBottom: 2,
    },
    '& > td > div > a': {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    '&:hover > td.done-loading > div': {
      paddingBottom: 1,
      borderWidth: 2,
      borderColor: palette.primary.main,
    },
    '& > td:first-child': {
      fontWeight: 600,
      '& div > a': {
        paddingLeft: spacing(0.75),
        overflow: 'hidden',
      },
      '& div > a > span': {
        whiteSpace: 'nowrap',
      },
    },
    '& td:not(:first-child)': {
      width: spacing(8),
    },
    [breakpoints.up('sm')]: {
      '& > td': {
        height: rowHeight,
      },
      '& td:not(:first-child)': {
        width: spacing(10),
      },
    },
    [breakpoints.up(breakpoints.values.sm + 120)]: {
      '& td:not(:first-child)': {
        width: spacing(13),
      },
    },
    [breakpoints.up('md')]: {
      '& td:not(:first-child)': {
        width: spacing(8),
      },
    },
    [breakpoints.up('lg')]: {
      '& td:not(:first-child)': {
        width: spacing(10),
      },
    },
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

const renderCell = formatter => ({ value, cell }) => (
  <Link to={`/company/${cell.row.original.symbol}`}>
    {/* {cell.column.id === 'changePercent' && (
      <ArrowIcon up={value >= 0} style={{ marginRight: 8 }} />
    )} */}
    <span>{formatter === undefined ? value : formatter(value)}</span>
  </Link>
)

const columns = [
  { accessor: 'companyName', Header: 'Company', Cell: renderCell() },
  { accessor: 'symbol', Header: 'Symbol', Cell: renderCell() },
  { accessor: 'latestPrice', Header: 'Price', Cell: renderCell(toCurrency) },
  { accessor: 'changePercent', Header: 'Today', Cell: renderCell(toPercent) },
  { accessor: 'volume', Header: 'Volume', Cell: renderCell(toSuffixed) },
]

// This removes the company type and/or stock type from columns.companyName
const regex = /(( Group)?,? Inc)?(Co(rp(oration)?)?)?( Ltd)?( - Class [A-Z])?\.?( - New)?$/

let count = 0

const TableView = React.memo(
  ({ classes, data, isLoading, isMobile }) => {
    console.log('React table:', ++count)

    const tableData = React.useMemo(
      () =>
        isLoading
          ? Array(20).fill({})
          : data.map(d => {
              d.companyName = d.companyName.replace(regex, '')
              return d
            }),
      [isLoading, data],
    )

    const tableColumns = React.useMemo(
      () =>
        isLoading
          ? columns.map(column => ({
              ...column,
              Cell: <Skeleton width='100%' />,
            }))
          : columns,
      [isLoading],
    )

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      setHiddenColumns,
      setSortBy,
      state,
    } = useTable(
      {
        columns: tableColumns,
        data: tableData,
        initialState: {
          hiddenColumns: isMobile ? ['companyName'] : [],
        },
        disableMultiSort: true,
      },
      useSortBy,
    )

    React.useEffect(() => {
      if (isMobile) {
        setHiddenColumns(['companyName'])
        if (state.sortBy.find(col => col.id === 'companyName')) {
          setSortBy([{ id: 'symbol' }])
        }
      } else {
        setHiddenColumns([])
      }
    }, [isMobile, state.sortBy, setHiddenColumns, setSortBy])

    return (
      <div className={classes.root}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className={classes.headRow}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={!isLoading && column.isSorted ? 'active' : ''}
                    aria-sort={
                      !isLoading && column.isSorted
                        ? column.isSortedDesc
                          ? 'desc'
                          : 'asc'
                        : 'none'
                    }
                  >
                    <TableSortLabel
                      className={classes.sortLabel}
                      active={column.isSorted}
                      disabled={isLoading}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    >
                      {column.render('Header')}
                      {column.isSorted ? (
                        <span className={classes.visuallyHidden}>
                          {column.isSortedDesc
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className={classes.bodyRow}>
                  {row.cells.map(cell => (
                    <td
                      className={isLoading ? 'loading' : 'done-loading'}
                      {...cell.getCellProps()}
                    >
                      <div>{cell.render('Cell')}</div>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isMobile === nextProps.isMobile
    )
  },
)

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

const TableContainer = ({ classes, data, isLoading }) => {
  const isMobile = useUnderBreakpoint(400)

  return (
    <TableView
      classes={classes}
      data={data}
      isLoading={isLoading}
      isMobile={isMobile}
    />
  )
}

const Table = () => {
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
    <>
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
          <TableContainer classes={classes} data={data} isLoading={isLoading} />
        </Paper>
      </TabPanel>
      <TabPanel value={listType} index={1} type='gainers'>
        <Paper className='paper' elevation={0}>
          <TableContainer classes={classes} data={data} isLoading={isLoading} />
        </Paper>
      </TabPanel>
      <TabPanel value={listType} index={2} type='losers'>
        <Paper className='paper' elevation={0}>
          <TableContainer classes={classes} data={data} isLoading={isLoading} />
        </Paper>
      </TabPanel>
    </>
  )
}

export default Table
