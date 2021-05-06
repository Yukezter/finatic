import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

// import useUnderBreakpoint from '../../shared/hooks/useUnderBreakpoint'

import Table from './Table'

const rowHeight = 52

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  tableHeadRow: {
    '& > th': {
      height: rowHeight,
      padding: 0,
      borderBottomWidth: 2,
      '& > span': {
        whiteSpace: 'nowrap',
      },
    },
    '& > th.active': {
      borderBottomColor: palette.primary.main,
    },
  },
  tableSortLabel: {
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
  tableBodyRow: {
    '& > th, & > td': {
      height: rowHeight,
      padding: 0,
      borderBottom: 0,
      '& > a': {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 2,
        borderBottom: '1px solid',
        borderBottomColor: 'rgba(224, 224, 224, 1)',
      },
    },

    '& > th': {
      fontWeight: 600,
      maxWidth: spacing(22),
      '& > a > span': {
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        paddingRight: spacing(1.5),
      },
    },

    '&:hover > td > a, &:hover > th > a': {
      paddingBottom: 1,
      borderWidth: 2,
      borderColor: palette.primary.main,
    },
  },
  companyNameCell: {
    display: 'table-cell',
  },
  symbolCell: {
    '& > a': {
      fontWeight: 500,
    },
    [breakpoints.up('sm')]: {
      '& > a': {
        fontWeight: 600,
      },
    },
  },
  marketCapCell: {
    [breakpoints.between(0, breakpoints.values.sm)]: {
      display: 'none',
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

let count = 0

const TableContainer = ({ data }) => {
  console.log('table:', ++count)

  const classes = useStyles()

  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('symbol')

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Table
      classes={classes}
      order={order}
      orderBy={orderBy}
      handleRequestSort={handleRequestSort}
      data={data}
    />
  )
}

export default TableContainer
