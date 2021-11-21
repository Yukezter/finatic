/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { utcToZonedTime } from 'date-fns-tz'
import { styled } from '@mui/material/styles'
import { useQuery } from 'react-query'
import { useSnackbar } from 'notistack'
import classNames from 'classnames'
import Calendar from 'react-calendar'
import { Theme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'
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
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'

import { yyyymmdd } from '../../Utils'
import { currency } from '../../Utils/numberFormats'
import { useTable } from '../../Hooks'
import { UserColumn } from '../../Hooks/useTable'
import { CalendarIcon, VeritcalDotsIcon, MarketDirectionIcon } from '../../Icons'
import { IconButton, RouterLink, MenuItem } from '../../Components'

import 'react-calendar/dist/Calendar.css'

const PREFIX = 'Root'

const classes = {
  Calendar: `${PREFIX}-Calendar`,
  removeTransform: `${PREFIX}-removeTransform`,
  Popper: `${PREFIX}-Popper`,
  selectedMenuItem: `${PREFIX}-selectedMenuItem`,
  table: `${PREFIX}-table`,
  th: `${PREFIX}-th`,
  tr: `${PREFIX}-tr`,
  paginationToolbar: `${PREFIX}-paginationToolbar`,
  paginationSpacer: `${PREFIX}-paginationSpacer`,
  paginationCaption: `${PREFIX}-paginationCaption`,
  paginationButton: `${PREFIX}-paginationButton`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.removeTransform}`]: {
    textTransform: 'none',
  },

  [`& .${classes.Popper}`]: {
    zIndex: theme.zIndex.mobileStepper,
  },

  [`& .${classes.table}`]: {
    borderCollapse: 'separate',
    tableLayout: 'auto',
  },

  [`& .${classes.th}`]: {
    width: 'auto',
    padding: '16px 8px',
    borderBottomWidth: 2,
    cursor: 'pointer',
    '&:first-of-type': {
      paddingLeft: 0,
    },
    '&.active': {
      borderBottomColor: theme.palette.primary.main,
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

  [theme.breakpoints.up(350)]: {
    [`& .${classes.table}`]: {
      tableLayout: 'fixed',
    },

    [`&.market-movers .${classes.th}:first-of-type`]: {
      width: '40%',
    },

    // [`&.upcoming-earnings .${classes.th}:nth-of-type(3)`]: {
    //   minWidth: 90,
    // },
  },

  [`& .${classes.tr}`]: {
    height: 56,
    '& > *:first-of-type > *': {
      paddingLeft: 0,
      fontWeight: theme.typography.fontWeightMedium,
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
      borderBottomColor: theme.palette.primary.main,
      borderBottomWidth: 2,
    },
  },

  [`& .${classes.paginationToolbar}`]: {
    justifyContent: 'space-between',
    paddingLeft: 0,
  },

  [`& .${classes.paginationSpacer}`]: {
    display: 'none',
  },

  [`& .${classes.paginationCaption}`]: {
    marginRight: 'auto',
  },

  [`& .${classes.paginationButton}`]: {
    borderRadius: theme.shape.borderRadius,
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
}))

const CalendarMenuRoot = styled('div')(({ theme }) => ({
  '& .react-calendar': {
    width: 280,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.default,
    border: 'none',
    boxShadow: theme.shadows[5],
    '& *': {
      fontFamily: theme.typography.body1.fontFamily,
    },
    '& abbr[title]': {
      textDecoration: 'none',
    },
    '& .react-calendar__navigation': {
      marginBottom: theme.spacing(0.5),
    },
    '& .react-calendar__month-view__weekdays': {
      fontSize: theme.typography.caption.fontSize,
    },
    '& .react-calendar__navigation__label': {
      background: theme.palette.background.default,
      fontSize: theme.typography.body2.fontSize,
      '&[disabled]': {
        background: theme.palette.background.default,
        color: theme.palette.action.disabled,
      },
    },
    '& .react-calendar__navigation__arrow': {
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      '&[disabled]': {
        background: 'initial',
        color: theme.palette.action.disabled,
        '&:hover': {
          background: 'initial',
        },
      },
      '&:enabled:hover': {
        background: theme.palette.action.hover,
      },
    },
    '& .react-calendar__tile': {
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      fontSize: theme.typography.body2.fontSize,
      '&:enabled:hover': {
        background: theme.palette.action.hover,
      },
      '&:enabled:focus': {
        background: theme.palette.action.focus,
      },
      '&:disabled': {
        color: theme.palette.action.disabled,
      },
    },
    '& .react-calendar__tile--now': {
      background: 'initial',
    },
    '& .react-calendar__tile--active': {
      background: `${theme.palette.primary.main} !important`,
    },
  },

  [theme.breakpoints.up(350)]: {
    '& .react-calendar': {
      width: 300,
    },
  },
}))

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
        <VeritcalDotsIcon height={30} width={30} />
      </IconButton>
      <Popper
        className={classes.Popper}
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        role={undefined}
        keepMounted
        disablePortal
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Container
            disableGutters
            component={Paper}
            elevation={5}
            style={{ backgroundImage: 'none' }}
          >
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

export const MarketMoversTable = () => {
  // eslint-disable-next-line no-plusplus
  console.log('Table: ', ++count)
  const matches = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down(440))
  const { enqueueSnackbar } = useSnackbar()

  const [selectedOption, setSelectedOption] = React.useState(menuOptions[0])

  const { data, isSuccess } = useQuery<any[], Error>(
    `/market-movers/${selectedOption.value}`,
    {
      onError: err => {
        enqueueSnackbar(
          `An error occurred while requesting ${selectedOption.label.toLowerCase()}.`,
          { variant: 'error' }
        )
        console.log(err)
      },
    }
  )

  const columns: UserColumn[] = React.useMemo(
    () => [
      {
        id: 'companyName',
        Header: 'Name',
        disablePadding: true,
      },
      {
        id: 'symbol',
        Header: 'Symbol',
      },
      {
        id: 'latestPrice',
        sortType: 'number',
        Header: 'Price',
        Cell: (value: number) => currency(value, '-'),
      },
      {
        id: 'change',
        sortType: 'number',
        Header: 'Today',
        Cell: (value: number) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MarketDirectionIcon value={value} title='Price change direction icon' />
            {`${Math.abs(value).toFixed(2)}%`}
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
    data: !isSuccess ? new Array(10).fill({}) : (data as any[]),
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
    <Root className='market-movers'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h5' color='textPrimary' gutterBottom>
          {selectedOption.label}
        </Typography>
        <MarketMoversMenu
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </Box>
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
                  className={classNames(classes.th, column.isSorted && 'active')}
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
    </Root>
  )
}

type CalendarMenuProps = {
  data: any[] | undefined
  setFilters: any
}

const CalendarMenu = React.memo(({ data, setFilters }: CalendarMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const dates = React.useMemo(() => {
    if (!data) return []

    return [
      ...new Set<Date>(
        data.map((report: any) => utcToZonedTime(report.reportDate, 'America/New_York'))
      ),
    ]
  }, [data])

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  const handleToggle = () => {
    setOpen(prevState => !prevState)
  }

  const handleChange = (date: Date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
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
      setFilters([{ id: 'reportDate', value: selectedDate }])
    }
  }, [selectedDate])

  // const handleListKeyDown = (event: React.KeyboardEvent) => {
  //   if (event.key === 'Tab') {
  //     event.preventDefault()
  //     setOpen(false)
  //   }
  // }

  return (
    <CalendarMenuRoot>
      <IconButton
        ref={anchorRef}
        color='primary'
        onClick={handleToggle}
        size='large'
        disabled={!data}
        sx={{ ':hover': { background: 'none' } }}
      >
        <CalendarIcon height={28} width={28} />
      </IconButton>
      {data && (
        <Popper
          className={classes.Popper}
          anchorEl={anchorRef.current}
          open={open}
          role={undefined}
          placement='bottom-end'
          disablePortal
          keepMounted
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
                minDate={new Date(Math.min(...dates.map(date => date.getTime())))}
                maxDate={new Date(Math.max(...dates.map(date => date.getTime())))}
                minDetail='month'
                tileDisabled={({ date: tile }) => {
                  return !dates.find(date => yyyymmdd(date) === yyyymmdd(tile))
                }}
              />
            </div>
          </ClickAwayListener>
        </Popper>
      )}
    </CalendarMenuRoot>
  )
})

export const UpcomingEarningsTable = () => {
  const matches = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down(600))
  const { enqueueSnackbar } = useSnackbar()

  const { data, isSuccess } = useQuery<any[], Error>('/stock/market/upcoming-earnings', {
    onError: err => {
      enqueueSnackbar('An error occurred while requesting upcoming earnings.', {
        variant: 'error',
      })

      console.log(err)
    },
  })

  const columns: UserColumn[] = React.useMemo(
    () => [
      {
        id: 'symbol',
        Header: 'Symbol',
      },
      {
        id: 'reportDate',
        Header: 'Report Date',
        sortType: 'datetime',
        accessor: (value: Date = new Date()) => utcToZonedTime(value, 'America/New_York'),
        Cell: (_: number, { cell }: any) => cell.row.original.reportDate,
        filter: (row: any, value: Date) => yyyymmdd(row.values.reportDate) === yyyymmdd(value),
      },
      {
        id: 'announceTime',
        Header: 'Report Time',
        Cell: (value: string | null) => {
          switch (value) {
            case 'bto':
              return 'Before open'
            case 'amc':
              return 'After close'
            case 'other':
              return 'During market'
            default:
              return 'N/A'
          }
        },
      },
      {
        id: 'consensusEPS',
        Header: 'Estimate EPS',
        sortType: 'number',
      },
      {
        id: 'fiscalPeriod',
        Header: 'Fiscal Period',
        disableSort: true,
        Cell: (_: Date, { cell }: any) => cell.row.original.fiscalPeriod,
      },
    ],
    []
  )

  const skeletonData = React.useMemo(() => new Array(5).fill({}), [])

  const skeletonColumns = React.useMemo(
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
    data: !isSuccess ? skeletonData : (data as any[]),
    columns: !isSuccess ? skeletonColumns : columns,
    initialState: {
      orderBy: 'reportDate',
      rowsPerPage: 5,
      hiddenColumns: matches ? ['consensusEPS'] : [],
    },
  })

  const isAfterFirstRender = React.useRef<boolean>(false)

  React.useEffect(() => {
    if (isAfterFirstRender.current) {
      if (matches) {
        setHiddenColumns(['consensusEPS'])
      } else {
        setHiddenColumns([])
      }
    } else {
      isAfterFirstRender.current = true
    }
  }, [matches])

  const emptyRows =
    state.rowsPerPage -
    Math.min(state.rowsPerPage, rows.length - state.page * state.rowsPerPage)

  return (
    <Root className='upcoming-earnings'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h5' color='textPrimary' gutterBottom>
          Upcoming Earnings
        </Typography>
        <CalendarMenu data={data} setFilters={setFilters} />
      </Box>
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
                  className={classNames(classes.th, column.isSorted && 'active')}
                  sortDirection={isSuccess && column.isSorted ? state.order : false}
                  style={{ cursor: column.disableSort ? 'default' : 'pointer' }}
                >
                  <TableSortLabel
                    disabled={!isSuccess || column.disableSort}
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
                        <RouterLink to={`/company/${row.original.symbol}`} underline='none'>
                          {cell.render()}
                        </RouterLink>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: emptyRows * 57.25 }}>
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
    </Root>
  )
}
