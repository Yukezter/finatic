import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { throttle } from 'lodash'
import clsx from 'clsx'
import Chart from 'chart.js'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import Button from '../shared/components/Button'

import useMergeState from '../shared/hooks/useMergeState'
import { toCurrency, toPercent } from '../shared/utils/numberFormat'

import createOptions from './createOptions'
import Skeleton from '@material-ui/lab/Skeleton'

// const compare = (a, b) => {
//   const digit = i => v => Math.floor(v / Math.pow(10, i)) % 10

//   const color = a > b ? 'green' : 'red'

//   return Array.from({ length: Math.ceil(Math.log10(Math.max(a, b))) }, (_, i) =>
//     ((l, r) => (l === r ? { color, bool: null } : { color, bool: l > r }))(
//       ...[a, b].map(digit(i)),
//     ),
//   ).reverse()
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

const findFirstDefinedPrice = data => {
  const price = data.find(element => element && element.y)
  return price ? price.y : null
}

let chartCount = 0

const LineChart = memo(({ theme, classes, symbol, range, setRangeData }) => {
  console.log('Stock chart:', ++chartCount)

  const canvasRef = useRef()
  const chartRef = useRef()

  const [chart, setChart] = useState({ isLoading: true, data: [] })

  const handleChartHover = useCallback(
    (_event, elements) => {
      setRangeData(prevState => {
        const newState = {
          price: null,
          change: null,
          changePercent: null,
        }

        const element = elements[0]

        if (element) {
          const data = element._chart.config.data.datasets[0].data
          const hoverElement = data[element._index]

          if (hoverElement && hoverElement.y) {
            newState.price = hoverElement.y

            if (prevState.firstRangePrice) {
              const difference = newState.price - prevState.firstRangePrice
              newState.change = difference
              newState.changePercent = zeroIfNaN(difference / prevState.firstRangePrice)
            }
          }
        }

        return newState
      })
    },
    [setRangeData],
  )

  const options = useRef(createOptions(theme, chart.data, throttle(handleChartHover, 100)))

  // Request connection and add/remove listeners
  // This only runs when range prop updates
  useEffect(() => {
    const es = new EventSource(`http://localhost:8001/sse/stock/chart/${range}?symbols=${symbol}`)

    // Update tooltip format based on range
    const time = options.current.options.scales.xAxes[0].time
    if (range === '1d') {
      time.tooltipFormat = 'h:mm A'
    } else if (range === '5dm') {
      time.tooltipFormat = 'MMM Do, h:mm A'
    } else {
      time.tooltipFormat = 'll'
    }

    const dataListener = data => {
      let chartData = JSON.parse(data.data)

      // Format chart data
      if (range === '1d' || range === '5dm') {
        chartData = chartData.map(d => ({
          y: d.average,
          x: new Date(`${d.date} ${d.minute}`),
        }))
      } else {
        chartData = chartData.map(d => ({
          y: d.close,
          x: new Date(d.date),
        }))
      }

      setChart({ loading: false, data: chartData })
    }

    const errorListener = err => {
      console.log(err)
      es.close()
    }

    es.addEventListener('error', errorListener)
    es.addEventListener(symbol, dataListener)

    return () => {
      es.removeEventListener('error', errorListener)
      es.removeEventListener(symbol, dataListener)
      es.close()

      setChart({ isLoading: true, data: [] })
    }
  }, [symbol, range, setRangeData, setChart])

  // Create/update chart instance
  useEffect(() => {
    if (!chartRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      chartRef.current = new Chart(ctx, options.current)
    } else {
      // Update chart data
      options.current.data.datasets[0].data = chart.data
      chartRef.current.update()
    }
  }, [chart])

  // Update parent component's range data
  useEffect(() => {
    let hasUpdated = false

    if (!chart.isLoading && !hasUpdated) {
      const newState = {
        firstRangePrice: findFirstDefinedPrice(chart.data),
        change: null,
        changePercent: null,
      }

      if (range !== '1d') {
        const lastPrice = findFirstDefinedPrice([...chart.data].reverse())
        const difference = lastPrice - newState.firstRangePrice
        newState.change = difference
        newState.changePercent = difference / newState.firstRangePrice
      }

      setRangeData(newState)

      hasUpdated = true
    }
  }, [range, chart, setRangeData])

  // Prevent subsequent mousemove/mouseout event from firing if initiated by touch
  const handleTouchEnd = event => {
    if (event.cancelable) event.preventDefault()
  }

  return (
    <div className={classes.chart}>
      <canvas id='stock-price-chart' ref={canvasRef} onTouchEnd={handleTouchEnd} />
    </div>
  )
})

const Price = memo(({ classes, quote, price }) => (
  <Typography className={classes.price} variant='h3' component='h1'>
    {quote.isLoading ? <Skeleton width={150} /> : toCurrency(price !== null ? price : quote.data.latestPrice)}
  </Typography>
))

const Change = memo(({ quote, change, changePercent, hide }) => (
  <Typography variant='subtitle2' component='div'>
    {quote.isLoading ? (
      <Skeleton width={150} />
    ) : (
      <>
        <span>{toCurrency(change !== null ? change : quote.data.change)}</span>{' '}
        <span>({toPercent(changePercent !== null ? changePercent : quote.data.changePercent)})</span>{' '}
        <span className={clsx(hide && 'hide')}>Today</span>
      </>
    )}
  </Typography>
))

const ExtendedChange = memo(({ quote, hide }) => (
  <Typography variant='subtitle2' component='span'>
    {quote.isLoading ? (
      <Skeleton width={150} />
    ) : (
      quote.data.extendedChange !== null && (
        <div className={clsx(hide && 'hide')}>
          <span>{toCurrency(quote.data.extendedChange)}</span>{' '}
          <span>{toPercent(quote.data.extendedChangePercent)}</span> <span>After-hours</span>
        </div>
      )
    )}
  </Typography>
))

let containerCount = 0

const StockChart = ({ theme, symbol }) => {
  console.log('Stock chart container:', ++containerCount)

  const classes = useStyles()

  const [quote, setQuote] = useState({ isLoading: true, data: {} })

  const [state, mergeState] = useMergeState({
    range: '1d',
    firstRangePrice: null,
    price: null,
    change: null,
    changePercent: null,
  })

  useEffect(() => {
    const es = new EventSource(`http://localhost:8001/sse/stock/quote?symbols=${symbol}`)

    const dataListener = data => {
      setQuote({ loading: false, data: JSON.parse(data.data) })
    }

    const errorListener = err => {
      console.log(err)
      es.close()
    }

    es.addEventListener('error', errorListener)
    es.addEventListener(symbol, dataListener)

    return () => {
      es.removeEventListener('error', errorListener)
      es.removeEventListener(symbol, dataListener)
      es.close()
    }
  }, [symbol, setQuote])

  const handleButtonClick = range => () => {
    if (state.range !== range) mergeState({ range })
  }

  return (
    <div className={classes.root}>
      <Price classes={classes} price={state.price} quote={quote} />
      <Change
        quote={quote}
        change={state.change}
        changePercent={state.changePercent}
        hide={state.range !== '1d' || state.price !== null}
      />
      <ExtendedChange quote={quote} hide={state.range !== '1d' || state.price !== null} />
      <LineChart
        theme={theme}
        classes={classes}
        symbol={symbol}
        range={state.range}
        setRangeData={mergeState}
      />
      <div className={classes.buttons}>
        {['1d', '5dm', '1m', '3m', '1y'].map(range => (
          <Button
            key={range}
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
