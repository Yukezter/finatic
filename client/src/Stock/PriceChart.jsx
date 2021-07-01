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

const getFirstDefinedPrice = data => {
  const price = data.find(element => element && element.y)
  return price ? price.y : null
}

const ranges = [
  { value: '1d', buttonText: '1D', label: 'Today' },
  { value: '5dm', buttonText: '5D', label: 'Last Week' },
  { value: '1m', buttonText: '1M', label: 'Last Month' },
  { value: '3m', buttonText: '3M', label: 'Last 3 Months' },
  { value: '1y', buttonText: '1Y', label: 'Last Year' },
]

let chartCount = 0

const ChartCanvas = memo(({ theme, classes, symbol, range, setInteractive }) => {
  console.log('Stock chart:', ++chartCount)

  const canvasRef = useRef()
  const chartRef = useRef()

  const [{ isLoading, data }, setChart] = useState({ isLoading: true, data: [] })

  const handleChartHover = useCallback(
    (_event, elements) => {
      setInteractive(prevState => {
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

            if (prevState.firstPrice) {
              const difference = newState.hoverPrice - prevState.firstPrice

              newState.hoverChange = difference
              newState.hoverChangePercent = zeroIfNaN(difference / prevState.firstPrice)
            }
          }
        }

        return newState
      })
    },
    [setInteractive],
  )

  const options = useRef(createOptions(theme, data, throttle(handleChartHover, 100)))

  // Request connection and add/remove listeners
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

    const dataListener = event => {
      let newData = JSON.parse(event.data)

      // Format chart data
      if (range === '1d' || range === '5dm') {
        newData = newData.map(d => ({
          y: d.average,
          x: new Date(`${d.date} ${d.minute}`),
        }))
      } else {
        newData = newData.map(d => ({
          y: d.close,
          x: new Date(d.date),
        }))
      }

      setChart({ loading: false, data: newData })
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
  }, [symbol, range, setInteractive, setChart])

  // Create/update chart instance
  useEffect(() => {
    if (!chartRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      chartRef.current = new Chart(ctx, options.current)
    } else {
      // Update chart data
      options.current.data.datasets[0].data = data
      chartRef.current.update()
    }
  }, [data])

  // Update parent component's range data
  useEffect(() => {
    let hasUpdated = false

    if (!isLoading && !hasUpdated) {
      const newState = {
        firstPrice: getFirstDefinedPrice(data),
        change: null,
        changePercent: null,
        label: ranges.find(r => r.value === range).label,
      }

      if (range !== '1d') {
        const lastPrice = getFirstDefinedPrice([...data].reverse())
        const difference = lastPrice - newState.firstPrice
        newState.change = difference
        newState.changePercent = difference / newState.firstPrice
      }

      setInteractive(newState)

      hasUpdated = true
    }
  }, [range, isLoading, data, setInteractive])

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

const Price = memo(({ classes, realtime, interactive }) => (
  <Typography className={classes.price} variant='h3' component='h1'>
    {realtime.isLoading ? (
      <Skeleton width={150} />
    ) : (
      toCurrency(interactive.hoverPrice !== null ? interactive.hoverPrice : realtime.data.latestPrice)
    )}
  </Typography>
))

const Change = memo(({ realtime, interactive }) => (
  <Typography variant='subtitle2' component='div'>
    {realtime.isLoading ? (
      <Skeleton width={150} />
    ) : (
      <>
        <span>
          {toCurrency(
            interactive.hoverChange !== null
              ? interactive.hoverChange
              : interactive.change !== null
              ? interactive.change
              : realtime.data.change,
          )}
        </span>{' '}
        <span>
          (
          {toPercent(
            interactive.hoverChangePercent !== null
              ? interactive.hoverChangePercent
              : interactive.changePercent !== null
              ? interactive.changePercent
              : realtime.data.changePercent,
          )}
          )
        </span>{' '}
        <span>{interactive.label}</span>
      </>
    )}
  </Typography>
))

const ExtendedChange = memo(({ spacing, realtime, hide }) => (
  <Typography variant='subtitle2' component='span'>
    {realtime.isLoading ? (
      <Skeleton width={150} />
    ) : (
      <div style={{ height: spacing(2.75) }}>
        {realtime.data.extendedChange ? (
          <div className={clsx(hide && 'hide')}>
            <span>{toCurrency(realtime.data.extendedChange)}</span>{' '}
            <span>({toPercent(realtime.data.extendedChangePercent)})</span> <span>After-hours</span>
          </div>
        ) : null}
      </div>
    )}
  </Typography>
))

let containerCount = 0

const PriceChart = ({ theme, symbol }) => {
  console.log('Stock chart container:', ++containerCount)

  const classes = useStyles()

  const [realtime, setRealtime] = useState({ isLoading: true, data: {} })

  const [interactive, setInteractive] = useMergeState({
    range: '1d',
    firstPrice: null,
    change: null,
    changePercent: null,
    hoverPrice: null,
    hoverChange: null,
    hoverChangePercent: null,
    label: 'Today',
  })

  useEffect(() => {
    const es = new EventSource(`http://localhost:8001/sse/stock/quote?symbols=${symbol}`)

    const dataListener = data => {
      setRealtime({ loading: false, data: JSON.parse(data.data) })
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
  }, [symbol, setRealtime])

  const handleButtonClick = range => () => {
    if (interactive.range !== range) {
      setInteractive({ range })
    }
  }

  return (
    <div className={classes.root}>
      <Price classes={classes} realtime={realtime} interactive={interactive} />
      <Change realtime={realtime} interactive={interactive} />
      <ExtendedChange
        spacing={theme.spacing}
        realtime={realtime}
        hide={interactive.range !== '1d' || interactive.price !== null}
      />
      <ChartCanvas
        theme={theme}
        classes={classes}
        symbol={symbol}
        range={interactive.range}
        setInteractive={setInteractive}
      />
      <div className={classes.buttons}>
        {ranges.map(({ value, buttonText }) => (
          <Button
            key={value}
            className={clsx(classes.button, interactive.range === value && 'active')}
            onClick={handleButtonClick(value)}
          >
            {buttonText}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default PriceChart
