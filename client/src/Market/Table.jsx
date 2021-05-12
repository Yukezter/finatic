import React from 'react'
import { useTable, useSortBy } from 'react-table'
import { makeStyles } from '@material-ui/core/styles'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Skeleton from '@material-ui/lab/Skeleton'

import Link from '../shared/components/Link'
import ArrowIcon from '../shared/components/ArrowIcon'

import useUnderBreakpoint from '../shared/hooks/useUnderBreakpoint'
import { toCurrency, toPercent, toSuffixed } from '../shared/utils/numberFormat'

const rowHeightMobile = 48
const rowHeight = 54

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
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

const Table = ({ data, isLoading }) => {
  const classes = useStyles()
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

export default Table
