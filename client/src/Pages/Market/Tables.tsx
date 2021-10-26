/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import Calendar from 'react-calendar'
import { Theme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'

import { Icon, IconButton, RouterLink, DirectionIcon } from '../../Components'
import { useTable } from '../../Hooks'

import 'react-calendar/dist/Calendar.css'

const PREFIX = 'Tables'

const classes = {
  Calendar: `${PREFIX}-Calendar`,
  removeTransform: `${PREFIX}-removeTransform`,
  Popper: `${PREFIX}-Popper`,
  popperMenuPaper: `${PREFIX}-popperMenuPaper`,
  table: `${PREFIX}-table`,
  th: `${PREFIX}-th`,
  tr: `${PREFIX}-tr`,
  paginationToolbar: `${PREFIX}-paginationToolbar`,
  paginationSpacer: `${PREFIX}-paginationSpacer`,
  paginationCaption: `${PREFIX}-paginationCaption`,
  paginationButton: `${PREFIX}-paginationButton`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
}

const Root = styled('div')(
  ({ theme: { palette, shape, zIndex, shadows, typography, spacing, breakpoints } }) => ({
    [`& .${classes.Calendar}`]: {
      '& .react-calendar': {
        width: 300,
        padding: spacing(1),
        borderRadius: shape.borderRadius,
        background: palette.background.default,
        border: 'none',
        boxShadow: shadows[5],
        '& *': {
          fontFamily: typography.body1.fontFamily,
        },
        '& abbr[title]': {
          textDecoration: 'none',
        },
        '& .react-calendar__navigation': {
          marginBottom: spacing(0.5),
        },
        '& .react-calendar__month-view__weekdays': {
          fontSize: typography.caption.fontSize,
        },
        '& .react-calendar__navigation__label': {
          background: palette.background.default,
          fontSize: typography.body2.fontSize,
          '&[disabled]': {
            background: palette.background.default,
            color: palette.action.disabled,
          },
        },
        '& .react-calendar__navigation__arrow': {
          color: palette.text.primary,
          borderRadius: shape.borderRadius,
          '&[disabled]': {
            background: 'initial',
            color: palette.action.disabled,
            '&:hover': {
              background: 'initial',
            },
          },
          '&:enabled:hover': {
            background: palette.action.hover,
          },
        },
        '& .react-calendar__tile': {
          borderRadius: shape.borderRadius,
          background: palette.background.default,
          color: palette.text.primary,
          fontSize: typography.body2.fontSize,
          '&:enabled:hover': {
            background: palette.action.hover,
          },
          '&:enabled:focus': {
            background: palette.action.focus,
          },
          '&:disabled': {
            color: palette.action.disabled,
          },
        },
        '& .react-calendar__tile--now': {
          background: 'initial',
        },
        '& .react-calendar__tile--active': {
          background: `${palette.primary.main} !important`,
        },
      },
    },

    [`& .${classes.removeTransform}`]: {
      textTransform: 'none',
    },

    [`& .${classes.Popper}`]: {
      zIndex: zIndex.mobileStepper,
    },

    [`& .${classes.popperMenuPaper}`]: {
      // width: 100,
    },

    [`& .${classes.table}`]: {
      borderCollapse: 'separate',
      tableLayout: 'fixed',
    },

    [`& .${classes.th}`]: {
      width: 'auto',
      padding: '16px 8px',
      borderBottomWidth: 2,
      cursor: 'pointer',
      '&:first-of-type': {
        paddingLeft: 0,
      },
      '&.market-movers:first-of-type': {
        width: '40%',
      },
      '&.ipos:first-of-type': {
        width: '40%',
        [breakpoints.down(breakpoints.values.sm)]: {
          width: '30%',
        },
      },
      '&.active': {
        borderBottomColor: palette.primary.main,
      },
      '& svg': {
        marginTop: -2,
      },
      '& > * > div': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },

    [`& .${classes.tr}`]: {
      height: 56,
      '& > *:first-of-type > *': {
        paddingLeft: 0,
      },
      '& > * > *': {
        display: 'block',
        height: '100%',
        width: '100%',
        padding: '16px 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '&:hover > * > a': {
        marginBottom: -1,
        paddingBottom: 15,
        borderBottomStyle: 'solid',
        borderBottomColor: palette.primary.main,
        borderBottomWidth: 2,
      },
    },

    [`& .${classes.paginationToolbar}`]: {
      paddingLeft: 0,
    },

    [`& .${classes.paginationSpacer}`]: {
      display: 'none',
    },

    [`& .${classes.paginationCaption}`]: {
      marginRight: 'auto',
    },

    [`& .${classes.paginationButton}`]: {
      borderRadius: shape.borderRadius,
    },

    [`& .${classes.visuallyHidden}`]: {
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
  })
)

type CalendarMenuProps = {
  dates: Date[]
  setFilters: any
}

const CalendarMenu = React.memo(({ dates, setFilters }: CalendarMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  const handleToggle = () => {
    setOpen(prevState => !prevState)
  }

  const handleChange = (date: Date) => {
    if (date.toLocaleDateString() === selectedDate?.toLocaleDateString()) {
      setSelectedDate(null)
    } else {
      setSelectedDate(date)
    }
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  React.useEffect(() => {
    if (!selectedDate) {
      setFilters([])
    } else {
      setFilters([{ id: 'date', value: selectedDate }])
    }
  }, [selectedDate])

  // const handleListKeyDown = (event: React.KeyboardEvent) => {
  //   if (event.key === 'Tab') {
  //     event.preventDefault()
  //     setOpen(false)
  //   }
  // }

  return (
    <>
      <IconButton ref={anchorRef} color='primary' onClick={handleToggle} size='large'>
        <Icon name='calendar' height={28} width={28} />
      </IconButton>
      <Popper
        className={classes.Popper}
        anchorEl={anchorRef.current}
        open={open}
        role={undefined}
        placement='left-start'
        disablePortal
        keepMounted
        style={{ marginRight: 8 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div className={classes.Calendar}>
            <Calendar
              value={selectedDate}
              onChange={handleChange}
              defaultView='month'
              defaultActiveStartDate={undefined}
              activeStartDate={dates[0]}
              prevLabel={<ChevronLeft />}
              nextLabel={<ChevronRight />}
              prev2Label={null}
              next2Label={null}
              minDate={dates[dates.length - 1]}
              maxDate={dates[0]}
              minDetail='month'
              tileDisabled={({ date }) =>
                !dates.find(d => d.toLocaleDateString() === date.toLocaleDateString())
              }
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  )
})

const getDateHyphenFormat = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const IPOsTable = () => {
  const matches = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down(440))

  const range = React.useMemo(() => {
    const date = new Date()

    return {
      from: getDateHyphenFormat(date),
      to: getDateHyphenFormat(new Date(date.setMonth(date.getMonth() + 6))),
    }
  }, [])

  const { data, isSuccess } = useQuery<AxiosResponse<any>, Error>(
    `/ipos?from=${range.from}&to=${range.to}`
  )

  const columns = React.useMemo(
    () => [
      {
        id: 'name',
        disablePadding: true,
        Header: 'Name',
      },
      {
        id: 'symbol',
        disablePadding: false,
        Header: 'Symbol',
      },
      {
        id: 'date',
        accessor: (value: string) => new Date(value),
        disablePadding: false,
        Header: 'Date',
        Cell: (value: Date) =>
          value.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
          }),
        filter: (row: any, value: Date) =>
          row.values.date.toLocaleDateString() === value.toLocaleDateString(),
      },
      {
        id: 'price',
        disablePadding: false,
        Header: 'Price',
      },
    ],
    []
  )

  const columnsWithSkeleton = React.useMemo(
    () =>
      columns.map(column => ({
        ...column,
        Cell: <Skeleton />,
      })),
    []
  )

  const {
    headers,
    rows,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    getTableHeaderGroupProps,
    state,
    setPage,
    setFilters,
    setHiddenColumns,
  } = useTable({
    data: !isSuccess ? new Array(5).fill({}) : data!.data.ipoCalendar,
    columns: !isSuccess ? columnsWithSkeleton : columns,
    initialState: {
      orderBy: 'date',
      rowsPerPage: 5,
      hiddenColumns: matches ? ['name'] : [],
    },
  })

  const isAfterFirstRender = React.useRef<boolean>(false)

  React.useEffect(() => {
    if (isAfterFirstRender.current) {
      if (matches) {
        setHiddenColumns(['name'])
      } else {
        setHiddenColumns([])
      }
    } else {
      isAfterFirstRender.current = true
    }
  }, [matches])

  const dates = React.useMemo(
    () =>
      !isSuccess
        ? []
        : [...new Set(data!.data.ipoCalendar.map((d: any) => d.date))].map(
            (d: any) => new Date(d)
          ),
    [isSuccess, data]
  )

  const emptyRows =
    state.rowsPerPage -
    Math.min(state.rowsPerPage, rows.length - state.page * state.rowsPerPage)

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5' color='textPrimary' gutterBottom>
          Upcoming IPOs
        </Typography>
        <CalendarMenu dates={dates} setFilters={setFilters} />
      </div>
      <TableContainer>
        <Table
          {...getTableProps()}
          className={classes.table}
          aria-labelledby='tableTitle'
          aria-label='enhanced table'
        >
          <TableHead>
            <TableRow {...getTableHeaderGroupProps()}>
              {headers.map(column => (
                <TableCell
                  {...column.getHeaderProps()}
                  className={classNames(classes.th, 'ipos', column.isSorted && 'active')}
                  sortDirection={isSuccess && column.isSorted ? state.order : false}
                >
                  <TableSortLabel
                    disabled={!isSuccess}
                    active={column.isSorted}
                    direction={column.isSorted ? state.order : 'asc'}
                    hideSortIcon
                    style={{ width: '100%' }}
                  >
                    <div>{column.render()}</div>
                    {column.isSorted ? (
                      <span className={classes.visuallyHidden}>
                        {state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows
              .slice(
                state.page * state.rowsPerPage,
                state.page * state.rowsPerPage + state.rowsPerPage
              )
              .map(row => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()} className={classes.tr}>
                    {row.cells.map(cell => (
                      <TableCell {...cell.getCellProps()} padding='none'>
                        <RouterLink to={`/symbol/${row.original.symbol}`} underline='none'>
                          {cell.render()}
                        </RouterLink>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: emptyRows * 56 }}>
                <TableCell colSpan={headers.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        classes={{
          toolbar: classes.paginationToolbar,
          spacer: classes.paginationSpacer,
          // caption: classes.paginationCaption,
        }}
        component='div'
        variant='footer'
        count={rows.length}
        rowsPerPage={state.rowsPerPage}
        rowsPerPageOptions={[]}
        page={state.page}
        onPageChange={setPage}
        backIconButtonProps={{
          className: classes.paginationButton,
          size: 'small',
        }}
        nextIconButtonProps={{
          className: classes.paginationButton,
          size: 'small',
        }}
      />
    </div>
  )
}

type MenuOption = {
  value: 'mostactive' | 'gainers' | 'losers'
  label: string
}

const menuOptions: MenuOption[] = [
  {
    value: 'mostactive',
    label: 'Most Active',
  },
  {
    value: 'gainers',
    label: 'Gainers',
  },
  {
    value: 'losers',
    label: 'Losers',
  },
]

let count = 0

const MarketMoversMenu = ({ selectedOption, setSelectedOption }: any) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen(prevState => !prevState)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleSelect = (option: MenuOption) => () => {
    setSelectedOption(option)
    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div>
      <IconButton
        ref={anchorRef}
        id='top-movers-button'
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        size='large'
      >
        <Icon name='vertical-dots' height={30} width={30} />
      </IconButton>
      <Popper
        className={classes.Popper}
        open={open}
        anchorEl={anchorRef.current}
        // placement='left-start'
        placement='bottom-end'
        role={undefined}
        keepMounted
        disablePortal
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Container disableGutters component={Paper} elevation={5}>
            <MenuList
              id='menu-list-grow'
              aria-labelledby='top-movers-button'
              autoFocus={open}
              onKeyDown={handleListKeyDown}
            >
              {menuOptions.map(option => (
                <MenuItem
                  key={option.value}
                  selected={option.value === selectedOption.value}
                  onClick={handleSelect(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Container>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

const TopMoversTable = () => {
  // eslint-disable-next-line no-plusplus
  console.log('Table: ', ++count)
  const matches = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down(440))
  const [selectedOption, setSelectedOption] = React.useState(menuOptions[0])

  const { data, isSuccess } = useQuery<AxiosResponse<any[]>, Error>(
    `/market-movers/${selectedOption.value}`
  )

  const columns = React.useMemo(
    () => [
      {
        id: 'companyName',
        disablePadding: true,
        Header: 'Name',
      },
      {
        id: 'symbol',
        disablePadding: false,
        Header: 'Symbol',
      },
      {
        id: 'latestPrice',
        disablePadding: false,
        Header: 'Price',
        Cell: (value: any) => `$${value}`,
      },
      {
        id: 'change',
        disablePadding: false,
        Header: 'Today',
        Cell: (value: any) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DirectionIcon value={value} title='Price change direction icon' />
            {Math.abs(value)}%
          </div>
        ),
      },
    ],
    []
  )

  const columnsWithSkeleton = React.useMemo(
    () =>
      columns.map(column => ({
        ...column,
        Cell: <Skeleton />,
      })),
    []
  )

  const {
    headers,
    rows,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    getTableHeaderGroupProps,
    state,
    setHiddenColumns,
  } = useTable({
    data: !isSuccess ? new Array(10).fill({}) : data!.data,
    columns: !isSuccess ? columnsWithSkeleton : columns,
    initialState: {
      orderBy: 'symbol',
      hiddenColumns: matches ? ['companyName'] : [],
    },
  })

  const isAfterFirstRender = React.useRef<boolean>(false)

  React.useEffect(() => {
    if (isAfterFirstRender.current) {
      if (matches) {
        setHiddenColumns(['companyName'])
      } else {
        setHiddenColumns([])
      }
    } else {
      isAfterFirstRender.current = true
    }
  }, [matches])

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5' color='textPrimary' gutterBottom>
          {selectedOption.label}
        </Typography>
        <MarketMoversMenu
          classes={classes}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <TableContainer>
        <Table
          {...getTableProps()}
          className={classes.table}
          aria-labelledby='tableTitle'
          aria-label='enhanced table'
        >
          <TableHead>
            <TableRow {...getTableHeaderGroupProps()}>
              {headers.map(column => (
                <TableCell
                  {...column.getHeaderProps()}
                  className={classNames(
                    classes.th,
                    'market-movers',
                    column.isSorted && 'active'
                  )}
                  sortDirection={isSuccess && column.isSorted ? state.order : false}
                >
                  <TableSortLabel
                    disabled={!isSuccess}
                    active={column.isSorted}
                    direction={column.isSorted ? state.order : 'asc'}
                    hideSortIcon
                    style={{ width: '100%' }}
                  >
                    <div>{column.render()}</div>
                    {column.isSorted ? (
                      <span className={classes.visuallyHidden}>
                        {state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()} className={classes.tr}>
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()} padding='none'>
                      <RouterLink to={`/company/${row.original.symbol}`} underline='none'>
                        {cell.render()}
                      </RouterLink>
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default () => {
  return (
    <Root>
      <TopMoversTable />
      <IPOsTable />
    </Root>
  )
}
