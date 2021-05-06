import React from 'react'
import _ from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'

import { toCurrency, toPercent, toSuffixed } from '../../shared/utils/numberFormat'

import TableHead from './TableHead'
import Link from '../../shared/components/Link'

const MemoizedTableCell = React.memo(
  props => {
    console.log('body')
    const { children } = props
    return <TableCell {...props}>{children}</TableCell>
  },
  () => true,
)

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

const renderNum = value => (_.isNull(value) ? '-' : value)

let tableMemoCount = 0

const DataTable = React.memo(
  ({ classes, order, orderBy, handleRequestSort, data }) => {
    console.log(++tableMemoCount)

    return (
      <TableContainer>
        <Table aria-labelledby='tableTitle' aria-label='enhanced table'>
          <TableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`
              const {
                companyName,
                symbol,
                latestPrice,
                changePercent,
                marketCap,
                volume,
              } = row

              return (
                <TableRow
                  className={classes.tableBodyRow}
                  role='checkbox'
                  tabIndex={-1}
                  key={row.symbol}
                >
                  <MemoizedTableCell
                    className={classes.companyNameCell}
                    component='th'
                    id={labelId}
                    scope='row'
                  >
                    <Link to={`/company/${symbol}`}>
                      <span>{companyName}</span>
                    </Link>
                  </MemoizedTableCell>
                  <MemoizedTableCell className={classes.symbolCell}>
                    <Link to={`/company/${symbol}`}>{symbol}</Link>
                  </MemoizedTableCell>
                  <MemoizedTableCell>
                    <Link to={`/company/${symbol}`}>
                      {renderNum(toCurrency(latestPrice))}
                    </Link>
                  </MemoizedTableCell>
                  <MemoizedTableCell>
                    <Link to={`/company/${symbol}`}>
                      {renderNum(toPercent(changePercent))}
                    </Link>
                  </MemoizedTableCell>
                  <MemoizedTableCell className={classes.marketCapCell}>
                    <Link to={`/company/${symbol}`}>
                      {renderNum(toSuffixed(marketCap))}
                    </Link>
                  </MemoizedTableCell>
                  <MemoizedTableCell>
                    <Link to={`/company/${symbol}`}>
                      {renderNum(toSuffixed(volume))}
                    </Link>
                  </MemoizedTableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.order === nextProps.order && prevProps.orderBy === nextProps.orderBy
    )
  },
)

export default DataTable
