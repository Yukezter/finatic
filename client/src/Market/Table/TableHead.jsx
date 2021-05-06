import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const headCells = [
  { id: 'companyName', numeric: false, disablePadding: true, label: 'Company' },
  { id: 'symbol', numeric: false, disablePadding: false, label: 'Symbol' },
  { id: 'latestPrice', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'changePercent', numeric: true, disablePadding: false, label: 'Today' },
  { id: 'marketCap', numeric: true, disablePadding: false, label: 'Market Cap' },
  { id: 'volume', numeric: true, disablePadding: false, label: 'Volume' },
]

const MemoizedTableCell = React.memo(
  props => {
    console.log('Head')
    const { children } = props
    return <TableCell {...props}>{children}</TableCell>
  },
  (prevProps, nextProps) => {
    return prevProps.sortDirection === nextProps.sortDirection
  },
)

const EnhancedTableHead = props => {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow className={classes.tableHeadRow}>
        {headCells.map(headCell => (
          <MemoizedTableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            className={clsx({
              [classes.companyNameCell]: 'companyName' === headCell.id,
              [classes.marketCapCell]: 'marketCap' === headCell.id,
              active: orderBy === headCell.id,
            })}
          >
            <TableSortLabel
              className={classes.tableSortLabel}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </MemoizedTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
}

export default EnhancedTableHead
