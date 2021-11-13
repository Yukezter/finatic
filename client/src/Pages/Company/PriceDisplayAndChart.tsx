/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react'
// import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip,
  TooltipModel,
  ChartType,
  ChartConfiguration,
  ActiveElement,
  ChartEvent,
  ChartItem,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { Theme } from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { percent, currency } from '../../Utils/numberFormats'
import { useEventSource } from '../../Hooks'
import { Button } from '../../Components'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip
)

const getRandomData = () => {
  const firstDate = new Date()
  const data = Array.from(new Array(78)).map((_, index) => {
    return {
      y: index < 50 ? 143 + Math.random() * 15 : null,
      x: new Date(firstDate.getTime() + index * 1000 * 60 * 5),
    }
  })

  return data
}

const getTooltipFormat = (range: Range): string => {
  if (range === '1d') return 'p'
  if (range === '5d') return 'MMM dd, h:mm a'
  return 'MMM dd, yyyy'
}

const setTooltipFormat = (chart: Chart | any, range: Range) => {
  chart.options.scales!.x.time.tooltipFormat = getTooltipFormat(range)
}

const getPrices = (data: any[]) =>
  data.reduce((acc, curr) => {
    if (curr.y) acc.push(curr.y)
    return acc
  }, [])

const setMinMaxAxesValues = (chart: Chart | ChartConfiguration) => {
  const { data } = chart.data.datasets[0] as any

  // Y axis
  const yTicks = chart.options!.scales!.y
  const prices = getPrices(data)
  const minY = Math.min(...prices)
  const maxY = Math.max(...prices)
  const buffer = (maxY - minY) * 0.02
  yTicks!.min = minY - buffer
  yTicks!.max = maxY + buffer

  // X axis
  const minX = data[0].x.getTime()
  const maxX = data[data.length - 1].x.getTime()
  // const offset = (maxX - data[data.length - 2].x.getTime()) * 0.4
  chart!.options!.scales!.x!.min = minX
  chart!.options!.scales!.x!.max = maxX
}

type PriceChartProps = {
  theme: Theme
  chartCallback: (chart: Chart) => void
  rangeData: any
  setHoverRangeData: any
}

const PriceChart = React.memo(
  ({ theme, chartCallback, rangeData, setHoverRangeData }: PriceChartProps) => {
    const { range, data, firstPrice } = rangeData
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const chartRef = React.useRef<Chart>()

    const lastTouchEndTimestamp = React.useRef<number>()

    const customTooltip = React.useCallback(
      ({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<ChartType> }) => {
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

    const resetHoverRangeData = React.useCallback(() => {
      setHoverRangeData({})
    }, [])

    const onHover = React.useCallback((_e: ChartEvent, activeElements: ActiveElement[]) => {
      const newState: any = {}
      const activeElement: any = activeElements[0]

      if (activeElement) {
        const price = activeElement.element.parsed.y
        if (price) {
          newState.price = price
          if (firstPrice) {
            const diff = price - firstPrice
            newState.change = diff
            newState.changePercent = diff / firstPrice
          }
        }
      }

      setHoverRangeData(newState)
    }, [])

    const afterEvent = React.useCallback((_, args: any) => {
      const { event } = args
      if (event.type === 'mousemove') {
        /* Hide the tooltip if any throttled touchmove
        events occur after the ontouchend event */
        if (
          event.native.type === 'touchmove' &&
          lastTouchEndTimestamp.current &&
          event.native.timeStamp < lastTouchEndTimestamp.current
        )
          hideTooltip()
      }

      if (event.type === 'mouseout') {
        resetHoverRangeData()
      }
    }, [])

    const strokeColorRef = React.useRef<string>()
    React.useEffect(() => {
      strokeColorRef.current = theme.palette.text.secondary
    }, [theme])

    const beforeDraw = React.useCallback((chart: Chart) => {
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
    }, [])

    const config = React.useMemo<ChartConfiguration>(
      () => ({
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
        plugins: [
          {
            id: 'aft',
            afterEvent,
          },
          {
            id: 'vertical-line',
            beforeDraw,
          },
        ],
      }),
      []
    )

    React.useEffect(() => {
      const chart = chartRef.current
      if (chart) {
        chart!.data.datasets[0].data = data
        setTooltipFormat(chart, range)
        setMinMaxAxesValues(chart)
        chart.update()
      }
    }, [data])

    React.useEffect(() => {
      const chart = chartRef.current
      if (chart) {
        chart.data.datasets[0].hoverBorderColor = theme.palette.background.default
        chart.options.plugins!.tooltip!.external = customTooltip
        chart.update()
      }
    }, [theme])

    React.useEffect(() => {
      const ctx = canvasRef.current!.getContext('2d')
      setMinMaxAxesValues(config)
      const chart: Chart = new Chart(ctx as ChartItem, config)
      chartRef.current = chart

      /* This callback sets parent ref to chart.js instance, that way the
      the Price (sibling) component can update the intraday chart in real-time */
      chartCallback(chart)
      return () => {
        chart.destroy()
      }
    }, [])

    const handleOnTouchEnd = React.useCallback((event: TouchEvent) => {
      lastTouchEndTimestamp.current = event.timeStamp

      hideTooltip()
      resetHoverRangeData()
    }, [])

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
          onTouchEnd={handleOnTouchEnd as any}
        />
      </div>
    )
  }
)

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

const getFirstDefinedNumber = (
  format: (n: number) => string,
  ...args: (number | undefined)[]
): string | null => {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] !== undefined) {
      return format(args[i] as number)
    }
  }

  return null
}

const Price = React.forwardRef<Chart, { symbol: string; isChartDataSuccess: boolean } | any>(
  ({ symbol, isChartDataSuccess, rangeData, hoverRangeData }, chartRef) => {
    const [realtime, setRealtime] = React.useState<{
      isLoading: boolean
      quote: any
    }>({
      isLoading: true,
      quote: undefined,
    })

    useEventSource(`/sse/stock/quote?symbols=${symbol}`, (event: MessageEvent) => {
      const data = JSON.parse(event.data)[0]
      if (data) {
        setRealtime({
          isLoading: false,
          quote: data,
        })
      }
    })

    React.useEffect(() => {
      if (realtime.quote) {
        const chart = (chartRef as React.MutableRefObject<Chart>).current
        if (chart && rangeData.range === '1d') {
          /* Here we update the last active data point whenever the realtime price updates */
          const chartData: any[] = chart.data.datasets[0].data
          const lastChartPrice = [...chartData].reverse().find(v => v.y !== null)
          if (lastChartPrice) {
            lastChartPrice.y = realtime.quote.latestPrice
            chart.update()
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
            currency(hoverRangeData.price || realtime.quote.latestPrice)
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
                  {getFirstDefinedNumber(
                    currency,
                    hoverRangeData.change,
                    rangeData.change,
                    realtime.quote.change
                  )}
                </Typography>
                <Typography variant='body1' component='h5'>
                  {`(${getFirstDefinedNumber(
                    percent,
                    hoverRangeData.changePercent,
                    rangeData.changePercent,
                    realtime.quote.changePercent
                  )}) ${getRangeTitle(rangeData.range)}`}
                </Typography>
              </div>
            )
          )}
          {!realtime.isLoading &&
            realtime.quote.extendedChange !== null &&
            hoverRangeData.price === undefined &&
            rangeData.range === '1d' && (
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
  }
)

const getFirstPrice = (data: any[]): number | undefined => {
  const firstDefinedPrice = data.find(element => element && element.y)
  if (firstDefinedPrice) {
    return firstDefinedPrice.y
  }

  return undefined
}

type InteractiveChartProps = {
  theme: Theme
  symbol: string
  isChartDataSuccess: boolean
  rangeData: {
    range: Range
    data: any[]
    firstPrice: number | undefined
    change: number | undefined
    changePercent: number | undefined
  }
}

const InteractiveChart = ({
  theme,
  symbol,
  isChartDataSuccess,
  rangeData,
}: InteractiveChartProps) => {
  const chartRef = React.useRef<Chart>()

  const chartCallback = React.useCallback((chart: Chart) => {
    chartRef.current = chart
  }, [])

  const [hoverRangeData, setHoverRangeData] = React.useState<any>({})

  return (
    <>
      <Price
        ref={chartRef as React.MutableRefObject<Chart>}
        isChartDataSuccess={isChartDataSuccess}
        symbol={symbol}
        rangeData={rangeData}
        hoverRangeData={hoverRangeData}
      />
      <div style={{ height: 250, marginBottom: 16 }}>
        {isChartDataSuccess && (
          <PriceChart
            theme={theme}
            chartCallback={chartCallback}
            rangeData={rangeData}
            setHoverRangeData={setHoverRangeData}
          />
        )}
      </div>
    </>
  )
}

const formatData = (data: any[], range: Range): any[] => {
  if (range === '1d' && data.length < 78) {
    const firstDate = new Date(`${data[0].date} ${data[0].minute}`)
    const newData = [...new Array(78)].map((_, index) => {
      return {
        y: data[index] ? data[index].average : null,
        x: new Date(firstDate.getTime() + index * 1000 * 60 * 5),
      }
    })

    return newData
  }

  if (range === '1d' || range === '5d') {
    return data.map(d => ({
      y: d.average,
      x: new Date(`${d.date} ${d.minute}`),
    }))
  }

  return data.map(d => ({
    y: d.close,
    x: new Date(d.date),
  }))
}

type Range = '1d' | '5d' | '1m' | '3m' | '1y'

const ranges: Range[] = ['1d', '5d', '1m', '3m', '1y']

export default ({ theme, symbol }: { theme: Theme; symbol: string }) => {
  const [selectedRange, setSelectedRange] = React.useState(ranges[0])
  const { isSuccess, data: rangeData } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/chart/${selectedRange}`,
    cacheTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
    select: ({ data }) => {
      /* After receiving chart data, format it for chart.js,
      and attach any additional meta data needed */
      const chartData = formatData(data, selectedRange)
      const firstPrice = getFirstPrice(chartData)
      const newData: any = {
        range: selectedRange,
        data: chartData,
        firstPrice,
      }

      if (selectedRange !== '1d') {
        const lastPrice = getFirstPrice([...chartData].reverse())
        if (firstPrice && lastPrice) {
          const diff = lastPrice - firstPrice
          newData.change = diff
          newData.changePercent = diff / firstPrice
        }
      }

      return newData
    },
  })

  return (
    <Container disableGutters maxWidth={false} sx={{ mb: 2 }}>
      <InteractiveChart
        theme={theme}
        symbol={symbol}
        isChartDataSuccess={isSuccess}
        rangeData={rangeData || {}}
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
