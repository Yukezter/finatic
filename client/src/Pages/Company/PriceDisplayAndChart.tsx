/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/prop-types */
import React from 'react'
import { useQuery } from 'react-query'
import { zonedTimeToUtc } from 'date-fns-tz'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSnackbar, SnackbarKey } from 'notistack'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip,
  TooltipModel,
  ChartConfiguration,
  ActiveElement,
  Plugin,
  ChartItem,
  ScaleOptionsByType,
  ChartOptions,
} from 'chart.js'
import { DeepPartial } from 'chart.js/types/utils'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { Theme } from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { percent, currency } from '../../Utils/numberFormats'
import { useDidUpdateEffect, useEventSource } from '../../Hooks'
import { Button } from '../../Components'
import { GlobalState } from '../../Context/Global'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip
)

// const getRandomData = () => {
//   const firstDate = new Date()
//   const data = Array.from(new Array(78)).map((_, index) => {
//     return {
//       y: index < 50 ? 143 + Math.random() * 15 : null,
//       x: new Date(firstDate.getTime() + index * 1000 * 60 * 5),
//     }
//   })

//   return data
// }

const getTooltipFormat = (range: Range): string => {
  if (range === '1d') return 'p'
  if (range === '5d') return 'MMM dd, h:mm a'
  return 'MMM dd, yyyy'
}

type DataPoint = {
  y: number | null
  x: number
}

interface Scales {
  scales: {
    y: ScaleOptionsByType<'linear'>
    x: ScaleOptionsByType<'timeseries'>
  }
}

interface PriceChartType extends Chart<'line', DataPoint[]> {
  options: DeepPartial<ChartOptions<'line'> & Scales>
}

interface ChartConfig extends ChartConfiguration<'line', DataPoint[]> {
  options: DeepPartial<ChartOptions<'line'> & Scales>
}

const setTooltipFormat = (chart: PriceChartType, range: Range) => {
  chart!.options!.scales!.x!.time!.tooltipFormat = getTooltipFormat(range)
}

const setMinMaxAxesValues = (chart: PriceChartType | ChartConfig) => {
  const { data } = chart.data.datasets[0]

  /* Y axis min/max */
  const prices = data.map(dp => dp.y).filter(dp => dp)
  const minY = Math.min(...(prices as number[]))
  const maxY = Math.max(...(prices as number[]))

  const buffer = (maxY - minY) * 0.02

  const yTicks = chart.options!.scales!.y
  yTicks!.min = minY - buffer
  yTicks!.max = maxY + buffer

  /* X axis min/max */
  const minX = data[0].x
  const maxX = data[data.length - 1].x
  // const offset = (maxX - data[data.length - 2].x) * 0.4
  chart.options!.scales!.x!.min = minX
  chart.options!.scales!.x!.max = maxX
}

type PriceChartProps = {
  theme: Theme
  setChartRef: (chart: PriceChartType) => void
  chartData: ChartData
  setHoverChartData: React.Dispatch<React.SetStateAction<HoverChartData>>
}

const PriceChart = React.memo((props: PriceChartProps) => {
  const { theme, setChartRef, chartData, setHoverChartData } = props
  const { range, data, firstPrice } = chartData

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const chartRef = React.useRef<PriceChartType>()

  const lastTouchEndTimestamp = React.useRef<number>()

  const customTooltip = React.useCallback(
    ({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<'line'> }) => {
      let tooltipEl = document.getElementById('stock-price-chart-tooltip')

      if (!tooltipEl) {
        tooltipEl = document.createElement('div')
        tooltipEl.id = 'stock-price-chart-tooltip'

        const canvas: HTMLElement | null = document.getElementById('stock-price-chart')
        if (canvas && canvas.parentNode) {
          canvas.parentNode.appendChild(tooltipEl)
        }
      }

      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0'
        return
      }

      tooltipEl.classList.remove('above', 'below')

      if (tooltip.yAlign) {
        tooltipEl.classList.remove('no-transform')
        tooltipEl.classList.add(tooltip.yAlign)
      }

      if (tooltip.title) {
        const titleLines = tooltip.title || []
        let innerHtml = ''

        titleLines.forEach((title: string) => {
          innerHtml += `<span>${title}</span>`
        })

        tooltipEl.innerHTML = innerHtml
      }

      const position = chart.canvas.getBoundingClientRect()
      const halfTooltipWidth = tooltip.width / 2

      tooltipEl.style.opacity = '1'
      tooltipEl.style.position = 'absolute'
      tooltipEl.style.top = '0'
      tooltipEl.style.left = `${tooltip.caretX - halfTooltipWidth}px`
      tooltipEl.style.right = 'initial'
      tooltipEl.style.whiteSpace = 'nowrap'
      tooltipEl.style.fontFamily = theme.typography.body2.fontFamily as string
      tooltipEl.style.fontSize = theme.typography.body2.fontSize as string
      tooltipEl.style.fontWeight = theme.typography.body2.fontWeightRegular as string
      tooltipEl.style.color = theme.palette.text.secondary
      tooltipEl.style.pointerEvents = 'none'

      if (tooltip.caretX < halfTooltipWidth) {
        tooltipEl.style.left = '0'
      } else if (tooltip.caretX + halfTooltipWidth > position.width) {
        tooltipEl.style.left = 'initial'
        tooltipEl.style.right = '0'
      }
    },
    [theme]
  )

  const hideTooltip = React.useCallback(() => {
    const tooltipEl = document.getElementById('stock-price-chart-tooltip')
    if (tooltipEl) {
      tooltipEl.style.opacity = '0'
    }
  }, [])

  const resetHoverChartData = React.useCallback(() => {
    setHoverChartData({})
  }, [])

  const onHover = React.useCallback(
    (_, activeElements: ActiveElement[]) => {
      const newState: HoverChartData = {}
      const activeElement: any = activeElements[0]

      if (activeElement) {
        const price = activeElement.element.parsed.y
        if (price !== null) {
          newState.price = price
          if (firstPrice !== undefined) {
            console.log(price, firstPrice)
            const diff = price - firstPrice
            newState.change = diff
            newState.changePercent = diff ? diff / firstPrice : diff
          } else {
            newState.change = 0
            newState.changePercent = 0
          }
        }
      }

      setHoverChartData(newState)
    },
    [firstPrice]
  )

  const handleMouseEvents: Plugin<'line'> = React.useMemo(
    () => ({
      id: 'handle-mouse-events',
      afterEvent: (_, args) => {
        const { event } = args
        if (event.type === 'mousemove') {
          /* Hide the tooltip if any throttled touchmove
          events occur after the ontouchend event */
          if (
            event.native &&
            event.native.type === 'touchmove' &&
            lastTouchEndTimestamp.current &&
            event.native.timeStamp < lastTouchEndTimestamp.current
          )
            hideTooltip()
        }

        if (event.type === 'mouseout') {
          resetHoverChartData()
        }
      },
    }),
    []
  )

  /* Interactive vertical chart line */

  const strokeColorRef = React.useRef<string>()

  React.useEffect(() => {
    strokeColorRef.current = theme.palette.text.secondary
  }, [theme])

  const drawVerticalLine: Plugin<'line'> = React.useMemo(
    () => ({
      id: 'draw-vertical-line',
      beforeDraw: chart => {
        const activeElements = chart.getActiveElements()
        if (activeElements && activeElements.length) {
          const { ctx } = chart
          const { x } = activeElements[0].element
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x, chart.scales.y.top)
          ctx.lineTo(x, chart.scales.y.bottom)
          ctx.lineWidth = 1
          ctx.strokeStyle = strokeColorRef.current as string
          ctx.stroke()
          ctx.restore()
        }
      },
    }),
    []
  )

  const config = React.useMemo<ChartConfig>(
    () => ({
      plugins: [handleMouseEvents, drawVerticalLine],
      type: 'line',
      data: {
        datasets: [
          {
            data,
            fill: false,
            borderWidth: 3,
            borderColor: theme.palette.primary.main,
            tension: 0,
            spanGaps: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: theme.palette.primary.main,
            hoverBorderColor: theme.palette.background.default,
            backgroundColor: theme.palette.primary.main,
            pointHitRadius: 10,
          },
        ],
      },
      options: {
        events: ['mousemove', 'mouseout', 'touchmove', 'touchend'],
        parsing: false,
        normalized: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        onHover,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: customTooltip,
          },
        },
        scales: {
          y: {
            type: 'linear',
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
          x: {
            type: 'timeseries',
            adapters: {
              date: {
                locale: enUS,
              },
            },
            time: {
              tooltipFormat: getTooltipFormat(range),
              unit: 'day',
            },
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
            offset: true,
          },
        },
      },
    }),
    []
  )

  React.useEffect(() => {
    const chart = chartRef.current

    if (chart !== undefined) {
      chart.data.datasets[0].data = data
      setTooltipFormat(chart, range)
      setMinMaxAxesValues(chart)
      chart.options.onHover = onHover

      chart.update()
    }
  }, [data])

  React.useEffect(() => {
    const chart = chartRef.current

    if (chart !== undefined) {
      chart.data.datasets[0].hoverBorderColor = theme.palette.background.default
      chart.options.plugins!.tooltip!.external = customTooltip

      chart.update()
    }
  }, [theme])

  React.useEffect(() => {
    setMinMaxAxesValues(config)

    const ctx = canvasRef.current!.getContext('2d')
    const chart = new Chart(ctx as ChartItem, config)

    chartRef.current = chart

    /* This callback sets parent ref to chart.js instance so we can pass it to the
      Price component (sibling component) and update intraday data points in real-time */
    setChartRef(chart)

    return () => {
      chart.destroy()
    }
  }, [])

  const handleOnTouchEnd: React.TouchEventHandler<HTMLCanvasElement> = React.useCallback(
    event => {
      lastTouchEndTimestamp.current = event.timeStamp

      hideTooltip()
      resetHoverChartData()
    },
    []
  )

  return (
    <div
      style={{
        position: 'relative',
        height: 250,
        width: '100%',
        overflow: 'hidden',
        paddingTop: theme.spacing(3),
      }}
    >
      <canvas
        ref={canvasRef}
        id='stock-price-chart'
        style={{ height: '100%' }}
        onTouchEnd={handleOnTouchEnd}
      />
    </div>
  )
})

const getRangeTitle = (range: Range): string => {
  switch (range) {
    case '5d':
      return 'Last Week'
    case '1m':
      return 'Last Month'
    case '3m':
      return 'Last 3 Months'
    case '1y':
      return 'Last Year'
    default:
      return 'Today'
  }
}

const getFirstDefined = (...args: [...(number | undefined)[], number]): number => {
  const last = args.pop() as number
  const arg = args.find(value => value !== undefined)
  return arg !== undefined ? arg : last
}

const getFirstDataPointInRange = (data: DataPoint[]): DataPoint | undefined => {
  const firstDefinedPrice = data.find(dataPoint => dataPoint.y !== null)
  return !firstDefinedPrice ? undefined : firstDefinedPrice
}

type Range = '1d' | '5d' | '1m' | '3m' | '1y'

type ChartData = {
  range: Range
  data: DataPoint[]
  firstPrice: number | undefined
  change?: number
  changePercent?: number
}

type HoverChartData = {
  price?: number
  change?: number
  changePercent?: number
}

type PriceDataProps = {
  symbol: string
  isChartDataSuccess: boolean
  chartData: ChartData
  hoverChartData: HoverChartData
}

const PriceData = React.forwardRef<PriceChartType, PriceDataProps>((props, chartRef) => {
  const { symbol, isChartDataSuccess, chartData, hoverChartData } = props

  const [realtime, setRealtime] = React.useState<{ isLoading: boolean; quote: any }>({
    isLoading: true,
    quote: undefined,
  })

  const messageEventCallback = React.useCallback(event => {
    const data = JSON.parse(event.data)[0]

    if (data) {
      setRealtime({
        isLoading: false,
        quote: data,
      })
    }
  }, [])

  useEventSource(`/stock/quote?symbols=${symbol}`, messageEventCallback, {
    errorSnackbar: true,
    errorMessage: 'Live price updates unavailable.',
  })

  /* Update the most recent data point whenever the realtime price updates */
  React.useEffect(() => {
    const chart = (chartRef as React.MutableRefObject<PriceChartType>).current
    if (chart && chartData && chartData.range === '1d') {
      const { quote } = realtime
      // console.log(chart, chartData, quote)
      if (quote) {
        const dataPoints = chart.data.datasets[0].data
        const latestDataPoint = getFirstDataPointInRange([...dataPoints].reverse())

        // console.log('latestDataPoint', latestDataPoint)
        if (latestDataPoint) {
          const { latestUpdate } = quote
          const fiveMinutes = 1000 * 60 * 60
          /* Enure that new price update time is within 5 minute window of data point */
          if (
            latestUpdate >= latestDataPoint.x &&
            latestUpdate < latestDataPoint.x + fiveMinutes
          ) {
            latestDataPoint.y = quote.latestPrice
            chart.update()
          }

          // console.log(
          //   'Latest update',
          //   latestUpdate,
          //   new Date(latestDataPoint.x),
          //   new Date(latestUpdate)
          // )
        }
      }
    }
  }, [realtime.quote])

  return (
    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h2' component='h4'>
        {realtime.isLoading ? (
          <Skeleton width='15%' />
        ) : (
          currency(getFirstDefined(hoverChartData.price, realtime.quote.latestPrice))
        )}
      </Typography>
      <div style={{ minHeight: 50 }}>
        {realtime.isLoading ? (
          <Typography variant='body1'>
            <Skeleton width='15%' />
          </Typography>
        ) : (
          isChartDataSuccess && (
            <div style={{ display: 'flex' }}>
              <Typography variant='body1' style={{ marginRight: 4 }}>
                {currency(
                  getFirstDefined(
                    hoverChartData.change,
                    chartData.change,
                    realtime.quote.change
                  )
                )}
              </Typography>
              <Typography variant='body1' component='h5'>
                {`(${percent(
                  getFirstDefined(
                    hoverChartData.changePercent,
                    chartData.changePercent,
                    realtime.quote.changePercent
                  )
                )}) ${getRangeTitle((chartData as ChartData).range)}`}
              </Typography>
            </div>
          )
        )}
        {chartData &&
          chartData.range === '1d' &&
          !realtime.isLoading &&
          realtime.quote.extendedChange !== null &&
          hoverChartData.price === undefined && (
            <div style={{ display: 'flex' }}>
              <Typography variant='body1' component='h5' style={{ marginRight: 4 }}>
                {currency(realtime.quote.extendedChange)}
              </Typography>
              <Typography variant='body1' component='h5'>
                {`(${percent(realtime.quote.extendedChangePercent)})`}
              </Typography>
            </div>
          )}
      </div>
    </div>
  )
})

type InteractiveChartProps = {
  theme: Theme
  symbol: string
  isSuccess: boolean
  chartData: ChartData
}

const InteractiveChart = (props: InteractiveChartProps) => {
  const { theme, symbol, isSuccess, chartData } = props
  const chartRef = React.useRef<PriceChartType>()

  const setChartRef = React.useCallback((chart: PriceChartType) => {
    chartRef.current = chart
  }, [])

  const [hoverChartData, setHoverChartData] = React.useState<HoverChartData>({})

  return (
    <>
      <PriceData
        ref={chartRef as React.MutableRefObject<PriceChartType>}
        isChartDataSuccess={isSuccess}
        symbol={symbol}
        chartData={chartData}
        hoverChartData={hoverChartData}
      />
      <div style={{ height: 250, marginBottom: 16 }}>
        {isSuccess && (
          <PriceChart
            theme={theme}
            setChartRef={setChartRef}
            chartData={chartData}
            setHoverChartData={setHoverChartData}
          />
        )}
      </div>
    </>
  )
}

const tz = 'America/New_York'

const buildIntradayDataPoints = (range: Range, data: any[]): DataPoint[][] => {
  const realtimeDataPoints: DataPoint[] = []
  const delayedDataPoints: DataPoint[] = []

  const addDataPoint = (bucket: any = {}, time: number) => {
    const dataPoint: any = {
      y: null,
      x: time,
    }

    const realtimePrice = bucket.close || bucket.average

    if (realtimePrice !== undefined) {
      dataPoint.y = realtimePrice
    }

    realtimeDataPoints.push(dataPoint)

    const delayedPrice = bucket.marketClose || bucket.marketAverage

    if (delayedPrice !== undefined) {
      dataPoint.y = delayedPrice
    }

    delayedDataPoints.push(dataPoint)
  }

  if (range === '1d') {
    const firstDate = zonedTimeToUtc(`${data[0].date} ${data[0].minute}`, tz)
    Array.from(new Array(78)).forEach((_, index) => {
      const time = zonedTimeToUtc(firstDate.getTime() + index * 1000 * 60 * 5, tz).getTime()
      addDataPoint(data[index], time)
    })
  } else {
    data.forEach(bucket => {
      addDataPoint(bucket, zonedTimeToUtc(`${bucket.date} ${bucket.minute}`, tz).getTime())
    })
  }

  return [realtimeDataPoints, delayedDataPoints]
}

const buildDataPoints = (selectedRange: Range, data: any[]): DataPoint[] => {
  if (selectedRange === '1d' || selectedRange === '5d') {
    const [realtime, delayed] = buildIntradayDataPoints(selectedRange, data)

    return realtime.some(dataPoint => dataPoint.y !== null) ? realtime : delayed
  }

  return data.map(bucket => ({
    y: bucket.close,
    x: zonedTimeToUtc(bucket.date, tz).getTime(),
  }))
}

const ranges: Range[] = ['1d', '5d', '1m', '3m', '1y']

type Props = {
  globalState: GlobalState
  theme: Theme
  symbol: string
}

export default ({ globalState, theme, symbol }: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const snackbarKey = React.useRef<SnackbarKey>()
  const [selectedRange, setSelectedRange] = React.useState(ranges[0])

  // const cacheAndRefetchInterval = React.useMemo(() => {
  //   if (selectedRange === '1d' || selectedRange === '5d') {
  //     return 1000 * 30
  //   }

  //   return 1000 * 60 * 60
  //   // return 0
  // }, [selectedRange])

  const { isSuccess, data, refetch } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/chart/${selectedRange}`,
    // cacheTime: cacheAndRefetchInterval,
    // refetchInterval: cacheAndRefetchInterval,
    // refetchIntervalInBackground: true,
    notifyOnChangeProps: ['isSuccess', 'data'],
    onError: err => {
      enqueueSnackbar(`Unable to display ${selectedRange} chart.`, { variant: 'error' })
      console.log(err)
    },
    onSuccess: chartData => {
      if (!snackbarKey.current && chartData.range === '1d') {
        const definedDataPoints = chartData.data.filter(
          (dataPoint: DataPoint) => dataPoint.y !== null
        )

        if (definedDataPoints.length < Math.floor(chartData.data.length * 0.8)) {
          console.log('Defined data points', definedDataPoints)
          snackbarKey.current = enqueueSnackbar(
            'Limited intraday chart data for this company.',
            {
              variant: 'info',
            }
          )
        }
      }
    },
    select: data => {
      console.log('select')
      const dataPoints = buildDataPoints(selectedRange, data)
      const firstDataPoint = getFirstDataPointInRange(dataPoints)
      const firstPrice = firstDataPoint ? (firstDataPoint.y as number) : undefined

      const newData: ChartData = {
        range: selectedRange,
        data: dataPoints,
        firstPrice,
      }

      if (selectedRange !== '1d') {
        const lastDataPoint = getFirstDataPointInRange([...dataPoints].reverse())
        const lastPrice = lastDataPoint ? (lastDataPoint.y as number) : undefined

        if (firstPrice !== undefined && lastPrice !== undefined) {
          const diff = lastPrice - firstPrice
          newData.change = diff
          newData.changePercent = diff ? diff / firstPrice : diff
        }
      }

      return newData
    },
  })

  const { isMarketOpen } = globalState

  useDidUpdateEffect(() => {
    if (isMarketOpen) {
      console.log('useDidUpdateEffect', isMarketOpen)
      refetch()
    }
  }, [isMarketOpen])

  return (
    <Container disableGutters maxWidth={false} sx={{ mb: 2 }}>
      <InteractiveChart
        theme={theme}
        symbol={symbol}
        isSuccess={isSuccess}
        chartData={data as ChartData}
      />
      <div>
        {ranges.map(range => (
          <Button
            key={range}
            size='small'
            sx={{ mr: 0.5, minWidth: { xs: 50 } }}
            disabled={!isSuccess}
            color={range === selectedRange ? 'primary' : 'inherit'}
            variant={range === selectedRange ? 'outlined' : 'text'}
            onClick={() => setSelectedRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>
    </Container>
  )
}
