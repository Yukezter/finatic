import React from 'react'
import _ from 'lodash'
import clsx from 'clsx'
import Chart from 'chart.js'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import api from '../../shared/hooks/api'
import useMergeState from '../../shared/hooks/useMergeState'
import Button from '../../shared/components/Button'
import { toCurrency, toPercent } from '../../shared/utils/numberFormat'

import createOptions from './createOptions'

// const compare = (a, b) => {
//   const digit = i => v => Math.floor(v / Math.pow(10, i)) % 10

//   const color = a > b ? 'green' : 'red'

//   return Array.from({ length: Math.ceil(Math.log10(Math.max(a, b))) }, (_, i) =>
//     ((l, r) => (l === r ? { color, bool: null } : { color, bool: l > r }))(
//       ...[a, b].map(digit(i)),
//     ),
//   ).reverse()
// }

// const getRangeStartOrEndPrice = data => {
//   let index = 0
//   while (index < data.length) {
//     if (data[index] && data[index].y) {
//       return data[index].y
//     } else {
//       ++index
//     }
//   }

//   return null
// }

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    '& .hide': {
      visibility: 'hidden',
    },
  },
  price: {
    fontWeight: 600,
    marginBottom: spacing(2),
  },
  chart: {
    position: 'relative',
    height: spacing(26),
    width: '100%',
    [breakpoints.up('lg')]: {
      height: spacing(32),
    },
  },
  button: {
    paddingLeft: spacing(1.5),
    paddingRight: spacing(1.5),
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    fontWeight: 600,
    transition: 'none',
    '&.active': {
      borderBottomColor: palette.common.black,
    },
  },
}))

const zeroIfNaN = n => (Number.isNaN(n) ? 0 : n)

const getRangeStartOrEndPrice = (data, end = false) => {
  const price = (end ? [...data].reverse() : data).find(
    element => element && element.y,
  )
  return price ? price.y : null
}

let chartCount = 0

const LineChart = React.memo(
  ({ classes, theme, range, data, isSuccess, handleChartHover }) => {
    console.log('Stock chart:', ++chartCount)

    const canvasRef = React.useRef(null)
    const chartRef = React.useRef(null)

    React.useEffect(() => {
      if (!chartRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        chartRef.current = new Chart(
          ctx,
          createOptions(theme, options => {
            options.data.datasets[0].data = data || []
            options.options.hover.onHover = handleChartHover

            return options
          }),
        )
      }
    }, [theme, data, handleChartHover])

    React.useEffect(() => {
      if (isSuccess) {
        const time = chartRef.current.options.scales.xAxes[0].time
        chartRef.current.data.datasets[0].data = data

        if (range === '1d') {
          time.tooltipFormat = 'h:mm A'
        } else if (range === '5dm') {
          time.tooltipFormat = 'MMM Do, h:mm A'
        } else {
          time.tooltipFormat = 'll'
        }

        chartRef.current.update()
      }
    }, [range, data, isSuccess])

    // Prevent subsequent mousemove/mouseout event from firing if initiated by touch
    const handleTouchEnd = event => {
      if (event.cancelable) event.preventDefault()
    }

    return (
      <div className={classes.chart}>
        <canvas id='stock-price-chart' ref={canvasRef} onTouchEnd={handleTouchEnd} />
      </div>
    )
  },
  (prevProps, nextProps) => prevProps.isSuccess === nextProps.isSuccess,
)

const Price = React.memo(({ classes, price, hoverPrice }) => (
  <Typography className={classes.price} variant='h3' component='h1'>
    {toCurrency(hoverPrice !== null ? hoverPrice : price)}
  </Typography>
))

const Change = React.memo(
  ({
    range,
    change,
    changePercent,
    hoverPrice,
    hoverChange,
    hoverChangePercent,
  }) => (
    <Typography variant='subtitle2' component='div'>
      <span>{toCurrency(hoverChange !== null ? hoverChange : change)}</span>{' '}
      <span>
        (
        {toPercent(hoverChangePercent !== null ? hoverChangePercent : changePercent)}
        )
      </span>{' '}
      <span className={clsx((range !== '1d' || hoverPrice !== null) && 'hide')}>
        Today
      </span>
    </Typography>
  ),
)

const ExtendedChange = React.memo(
  ({ quote, range, hoverPrice }) =>
    quote.extendedChange !== null && (
      <div className={clsx((range !== '1d' || hoverPrice !== null) && 'hide')}>
        <Typography variant='subtitle2' component='span'>
          {toCurrency(quote.extendedChange)} (
          {toPercent(quote.extendedChangePercent)}) After-hours
        </Typography>
      </div>
    ),
)

let containerCount = 0

const StockChart = ({ theme, symbol, quote }) => {
  console.log('Stock chart container:', ++containerCount)

  const classes = useStyles()

  const [state, mergeState] = useMergeState({
    rangeKey: '1d',
    range: '1d',
    rangeStartPrice: null,
    price: quote.latestPrice,
    change: quote.change,
    changePercent: quote.changePercent,
    hoverPrice: null,
    hoverChange: null,
    hoverChangePercent: null,
  })

  const { data, isSuccess } = api.get(`/stock/${symbol}/chart/${state.rangeKey}`, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    notifyOnChangeProps: ['isSuccess', 'error'],
    onError: error => console.log(error),
    onSuccess: data => {
      const newState = {}

      const rangeStartPrice = getRangeStartOrEndPrice(data)

      if (state.range === '1d') {
        newState.change = quote.change
        newState.changePercent = quote.changePercent
      } else {
        const rangeEndPrice = getRangeStartOrEndPrice(data, true)
        const difference = rangeEndPrice - rangeStartPrice
        newState.change = difference
        newState.changePercent = difference / rangeStartPrice
      }

      newState.rangeStartPrice = rangeStartPrice

      mergeState(prevState => {
        newState.range = prevState.rangeKey
        return newState
      })
    },
  })

  const handleChartHover = _.throttle((_event, elements) => {
    mergeState(prevState => {
      const newState = {
        hoverPrice: null,
        hoverChange: null,
        hoverChangePercent: null,
      }

      const element = elements[0]

      if (element) {
        const data = element._chart.config.data.datasets[0].data
        const hoverElement = data[element._index]

        if (hoverElement && hoverElement.y) {
          newState.hoverPrice = hoverElement.y

          if (prevState.rangeStartPrice) {
            const difference = newState.hoverPrice - prevState.rangeStartPrice
            newState.hoverChange = difference
            newState.hoverChangePercent = zeroIfNaN(
              difference / prevState.rangeStartPrice,
            )
          }
        }
      }

      return newState
    })
  }, 50)

  const handleButtonClick = range => () => {
    if (state.range !== range) mergeState({ rangeKey: range })
  }

  console.log(isSuccess)

  return (
    <div className={classes.root}>
      <Price classes={classes} price={state.price} hoverPrice={state.hoverPrice} />
      <Change
        range={state.range}
        change={state.change}
        changePercent={state.changePercent}
        hoverChange={state.hoverChange}
        hoverChangePercent={state.hoverChangePercent}
      />
      <ExtendedChange
        quote={quote}
        range={state.range}
        hoverPrice={state.hoverPrice}
      />
      <LineChart
        classes={classes}
        theme={theme}
        range={state.range}
        data={data}
        isSuccess={isSuccess}
        handleChartHover={handleChartHover}
      />
      <div className={classes.buttons}>
        {['1d', '5dm', '1m', '3m', '1y'].map(range => (
          <Button
            className={clsx(classes.button, range === state.range && 'active')}
            onClick={handleButtonClick(range)}
          >
            {range === '5dm' ? '5d' : range}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default StockChart
