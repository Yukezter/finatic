import React from 'react'
// import { Skeleton } from '@material-ui/lab'

type Data = { [key: string]: string | number }

type CellRenderer =
  | string
  | JSX.Element
  | ((value: any | number, props?: any) => string | number | JSX.Element)

type Order = 'asc' | 'desc'

type State = {
  order: Order
  orderBy: keyof Data | null
  filters: Array<{ id: keyof Data; value: any }>
  page: number
  rowsPerPage: number
  hiddenColumns: string[]
}

enum ActionType {
  SET_ORDER_BY = 'SET_ORDER_BY',
  SET_PAGE = 'SET_PAGE',
  SET_FILTERS = 'SET_FILTERS',
  SET_HIDDEN_COLUMNS = 'SET_HIDDEN_COLUMNS',
}

type Action = {
  type: ActionType
  payload: any
}

type InitialState = {
  order?: Order
  orderBy?: keyof Data | null
  filters?: Array<{ id: keyof Data; value: any }>
  rowsPerPage?: number
  hiddenColumns?: string[]
}

type SortTypes = 'alphanumeric' | 'datetime'

type UserColumn = {
  id: keyof Data
  accessor?: (value: any) => any
  Header: string | (() => string | number | JSX.Element)
  Cell?: CellRenderer
  width?: string | number
  sortType?: SortTypes
  filter?: (row: Row, value: any) => boolean
}

type DefaultColumn = {
  id: keyof Data
  Header: string | (() => string | number | JSX.Element)
  Cell: CellRenderer
  sortType: SortTypes
}

interface Column extends DefaultColumn {
  id: keyof Data
  accessor: (value: any) => any
  Header: string | (() => string | number | JSX.Element)
  Cell: CellRenderer
  isVisible?: boolean
  isSorted?: boolean
  isSortedDesc?: boolean
  sortType: SortTypes
  filter: (row: Row, value: any) => boolean
  getHeaderProps?: (props?: any) => any
  render?: () => string | number | JSX.Element
}

type Row = {
  id: number | string
  original: any
  index: number
  allCells: Cell[]
  cells: Cell[]
  values: any
  getRowProps: (props?: any) => any
}

type Cell = {
  column: Column
  row: Row
  value: any
  getCellProps: (props?: any) => any
  render: () => string | number | JSX.Element
}

type TableProps = {
  columns: UserColumn[]
  // isLoading: boolean
  data: Data[]
  initialState?: InitialState
}

interface InstanceProps extends TableProps {
  columns: UserColumn[]
  allColumns: Column[]
  visibleColumns: Column[]
  headers: Column[]
  rows: Row[]
  initialState: InitialState
  state: State
  dispatch: React.Dispatch<Action>
  prepareRow: (row: Row) => void
  setPage: (event: any, newPage: number) => void
  setFilters: (filters: Array<{ id: keyof Data; value: any }>) => boolean
  setHiddenColumns: (hiddenColumns: string[]) => void
  getTableProps: (props?: any) => any
  getTableBodyProps: (props?: any) => any
  getTableHeaderGroupProps: (props?: any) => any
}

type Complete<T> = {
  [P in keyof Required<T>]: T[P] extends Column[] ? Required<Column>[] : T[P]
}

const compare: <T extends unknown>(a: T, b: T) => 0 | 1 | -1 = (a, b) => {
  // eslint-disable-next-line no-nested-ternary
  return a === b ? 0 : a > b ? 1 : -1
}

type SortTypeComparators = {
  [key in SortTypes]: (a: any, b: any) => 0 | 1 | -1
}

const sortTypeComparators: SortTypeComparators = {
  alphanumeric: compare,
  datetime: (a: Date, b: Date) => {
    return compare(a.getTime(), b.getTime())
  },
}

const getComparator = <Key extends keyof Data>(
  order: Order,
  orderBy: Key,
  sortType: SortTypes
): ((a: Row, b: Row) => number) => {
  const comparator = sortTypeComparators[sortType]
  return order === 'desc'
    ? (a, b) => comparator(a.values[orderBy], b.values[orderBy])
    : (a, b) => -comparator(a.values[orderBy], b.values[orderBy])
}

const defaultRenderer: CellRenderer = (value = '') => value

const defaultGetTableProps = (props: any) => ({
  role: 'table',
  ...props,
})

const defaultGetTableBodyProps = (props: any) => ({
  role: 'rowgroup',
  ...props,
})

const defaultGetHeaderGroupProps = (props: any) => ({
  role: 'row',
  ...props,
})

const defaultGetHeaderProps = (props: any, column: DefaultColumn) => ({
  key: `header_${column.id}`,
  // colSpan: column.totalVisibleHeaderCount,
  role: 'columnheader',
  ...props,
})

const defaultGetRowProps = (props: any, { id }: Row) => ({
  key: `row_${id}`,
  role: 'row',
  ...props,
})

const defaultGetCellProps = (props: any, cell: Cell) => ({
  key: `cell_${cell.row.id}_${cell.column.id}`,
  role: 'cell',
  ...props,
})

const defaultInitialState: State = {
  order: 'desc',
  orderBy: null,
  filters: [],
  page: 0,
  rowsPerPage: 10,
  hiddenColumns: [],
}

const addDefaults = ({ initialState = {}, ...props }: TableProps) => ({
  initialState,
  ...props,
})

let count = 0
export default (props: TableProps): Complete<InstanceProps> => {
  // eslint-disable-next-line no-plusplus
  console.log('useTable: ', ++count)
  const instanceRef = React.useRef<any>({})
  const getInstance = React.useCallback((): InstanceProps => instanceRef.current, [])

  Object.assign(getInstance(), addDefaults(props))

  const { data, columns, initialState } = getInstance()

  const reducer = React.useCallback(
    (state: State, action: Action): State => {
      if (!action.type) {
        console.info({ action })
        throw new Error('Unknown Action 👆')
      }

      switch (action.type) {
        case ActionType.SET_ORDER_BY:
          if (!columns.find(c => c.id === action.payload)) {
            throw new Error(`No column found with ID of ${action.payload}!`)
          }

          return {
            ...state,
            orderBy: action.payload,
            order:
              state.orderBy === action.payload && state.order === 'asc' ? 'desc' : 'asc',
          }
        case ActionType.SET_PAGE:
          return {
            ...state,
            page: action.payload,
          }
        case ActionType.SET_FILTERS:
          return {
            ...state,
            filters: action.payload,
            page: 0,
          }
        case ActionType.SET_HIDDEN_COLUMNS:
          if (!Array.isArray(action.payload)) {
            throw new Error("'hiddenColumns' must be an array! 👆")
          }

          return {
            ...state,
            hiddenColumns: action.payload,
          }
        default:
          throw new Error('No action type found!')
      }
    },
    [getInstance]
  )

  const [reducerState, reducerDispatch] = React.useReducer(reducer, {
    ...defaultInitialState,
    ...initialState,
  })

  Object.assign(getInstance(), {
    state: reducerState,
    dispatch: reducerDispatch,
  })

  const { state, dispatch } = getInstance()

  const allColumns = React.useMemo<Column[]>(
    () =>
      columns.map(
        ({
          accessor = value => value,
          Cell = defaultRenderer,
          sortType = 'alphanumeric',
          filter = () => false,
          ...column
        }) => {
          return {
            accessor,
            Cell,
            sortType,
            filter,
            ...column,
          }
        }
      ),
    [columns, getInstance]
  )

  getInstance().allColumns = allColumns

  const rows = React.useMemo<Row[]>(() => {
    const rowsById: { [key: string]: any } = {}

    return allColumns.reduce<Row[]>((rowsAcc, column) => {
      data.forEach((original, index) => {
        let row = rowsById[index]

        if (!row) {
          row = {
            id: index,
            original,
            index,
            cells: [],
            values: {},
          }

          rowsAcc.push(row)

          rowsById[index] = row
        }

        row.values[column.id] = column.accessor(original[column.id])
      })

      return rowsAcc
    }, [])
  }, [allColumns, data])

  getInstance().rows = rows

  allColumns.forEach(column => {
    column.isVisible = !state.hiddenColumns.find(id => id === column.id)
    column.isSorted = state.orderBy === column.id
    column.isSortedDesc = state.orderBy === column.id ? state.order === 'desc' : undefined
  })

  Object.assign(getInstance(), { allColumns })

  const visibleColumns = React.useMemo(
    () => allColumns.filter(column => column.isVisible),
    [allColumns, state.hiddenColumns]
  )

  Object.assign(getInstance(), { visibleColumns, headers: visibleColumns })

  const createSetOrderBy = React.useCallback(
    (id: keyof Data) => () => {
      dispatch({ type: ActionType.SET_ORDER_BY, payload: id })
    },
    [dispatch, visibleColumns]
  )

  const setPage = React.useCallback(
    (_event, newPage) => {
      dispatch({ type: ActionType.SET_PAGE, payload: newPage })
    },
    [dispatch]
  )

  const setFilters = React.useCallback(
    (filters: Array<{ id: keyof Data; value: any }>) => {
      dispatch({ type: ActionType.SET_FILTERS, payload: filters })
    },
    []
  )

  const setHiddenColumns = React.useCallback(
    hiddenColumns => {
      dispatch({ type: ActionType.SET_HIDDEN_COLUMNS, payload: hiddenColumns })
    },
    [dispatch]
  )

  const filteredRows = React.useMemo(
    () =>
      state.filters.reduce((prevRows, { id, value }) => {
        const column = visibleColumns.find(c => c.id === id)

        if (!column) {
          console.warn(`No column found with the ID: ${id}.`)
          return prevRows
        }

        if (!column.filter) {
          console.warn(`No valid 'column.filter' found for column[${column.id}].`)
          return prevRows
        }

        return prevRows.filter(row => column.filter(row, value))
      }, rows),
    [state.filters, rows]
  )

  Object.assign(getInstance(), { rows: filteredRows })

  if (state.orderBy) {
    const column = visibleColumns.find(c => c.id === state.orderBy)
    const comparator = getComparator(state.order, state.orderBy, column!.sortType)

    Object.assign(getInstance(), { rows: filteredRows.sort(comparator) })
  }

  allColumns.forEach(column => {
    column.getHeaderProps = (p = {}) => ({
      onClick: createSetOrderBy(column.id),
      ...defaultGetHeaderProps(p, column),
    })

    column.render = () => {
      return typeof column.Header === 'string' ? column.Header : column.Header()
    }
  })

  getInstance().prepareRow = React.useCallback(
    row => {
      row.getRowProps = (p = {}) => defaultGetRowProps(p, row)
      row.allCells = allColumns.map<Cell>(column => {
        const cell: any = {
          column,
          row,
          value: row.values[column.id],
        }

        cell.getCellProps = (p = {}) => defaultGetCellProps(p, cell)

        cell.render = () => {
          if (typeof column.Cell === 'function') {
            return column.Cell(cell.value, { column })
          }

          return column.Cell
        }

        return cell
      })

      row.cells = row.allCells.filter(cell => cell.column.isVisible)
    },
    [allColumns]
  )

  Object.assign(getInstance(), {
    getTableProps: (p = {}) => defaultGetTableProps(p),
    getTableBodyProps: (p = {}) => defaultGetTableBodyProps(p),
    getTableHeaderGroupProps: (p = {}) => defaultGetHeaderGroupProps(p),
    setPage,
    setFilters,
    setHiddenColumns,
  })

  return getInstance() as Complete<InstanceProps>
}
