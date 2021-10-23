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
  Plugin,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { Theme } from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { percent, currency } from '../../Utils/numberFormats'
import { Button } from '../../Components'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip
)

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

const setMinMaxYAxis = (chart: Chart | ChartConfiguration) => {
  const yTicks = chart.options!.scales!.y
  const prices = getPrices(chart.data.datasets[0].data)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const buffer = (max - min) * 0.02
  yTicks!.min = min - buffer
  yTicks!.max = max + buffer
}

const PriceChart = React.memo(
  ({
    theme,
    rangeData,
    setHoverRangeData,
  }: {
    theme: Theme
    rangeData: any
    setHoverRangeData: any
  }) => {
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
        tooltipEl.style.color = theme.palette.text.disabled
        tooltipEl.style.pointerEvents = 'none'

        if (tooltip.caretX < halfTooltipWidth) {
          tooltipEl.style.left = '0'
        } else if (tooltip.caretX + halfTooltipWidth > position.width) {
          tooltipEl.style.left = 'initial'
          tooltipEl.style.right = '0'
        }
      },
      []
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

    const onHover = React.useCallback(
      (_e: ChartEvent, activeElements: ActiveElement[]) => {
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
      },
      []
    )

    const beforeEvent = React.useCallback((chart: Chart, args: any) => {
      const { event } = args
      console.log('beforeEvent')
      console.log(args)
      console.log('\n\n')

      if (event.type === 'mouseout') {
        console.log('beforeEvent: mouseout')
      }
    }, [])

    const afterEvent = React.useCallback((chart: Chart, args: any) => {
      const { event } = args
      console.log('afterEvent')
      console.log(args)
      console.log('\n\n')

      if (event.type === 'mousemove') {
        console.log('afterEvent: mousemove')

        // Hide the tooltip if any throttled touchmove
        // events occur after the ontouchend event
        if (
          event.native.type === 'touchmove' &&
          lastTouchEndTimestamp.current &&
          event.native.timeStamp < lastTouchEndTimestamp.current
        )
          hideTooltip()
      }

      if (event.type === 'mouseout') {
        console.log('afterEvent: mouseout')
        resetHoverRangeData()
      }
    }, [])

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
        ctx.strokeStyle = theme.palette.text.disabled
        ctx.stroke()
        ctx.restore()
      }
    }, [])

    const configRef = React.useRef<ChartConfiguration>({
      type: 'line',
      data: {
        datasets: [
          {
            data,
            fill: false,
            borderWidth: 3,
            borderColor: theme.palette.primary.main,
            tension: 0,
            spanGaps: false,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
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
        responsive: true,
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
            },
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        layout: {
          padding: {
            left: Number(theme.spacing(0.75)),
            right: Number(theme.spacing(0.75)),
          },
        },
      },
      plugins: [
        {
          id: 'b4',
          beforeEvent,
        },
        {
          id: 'aft',
          afterEvent,
        },
        {
          id: 'vertical-line',
          beforeDraw,
        },
      ],
    })

    React.useEffect(() => {
      const chart = chartRef.current
      if (chart) {
        chart!.data.datasets[0].data = data
        setTooltipFormat(chart, range)
        setMinMaxYAxis(chart)

        chart.update()
      }
    }, [data])

    React.useEffect(() => {
      const ctx = canvasRef.current!.getContext('2d')
      setMinMaxYAxis(configRef.current)
      const chart = new Chart(ctx as ChartItem, configRef.current)
      chartRef.current = chart

      return () => {
        chart.destroy()
      }
    }, [])

    const handleOnTouchEnd = React.useCallback((event: TouchEvent) => {
      console.log('handleOnTouchEnd')
      console.log(event)

      lastTouchEndTimestamp.current = event.timeStamp

      hideTooltip()
      resetHoverRangeData()
    }, [])

    return (
      <div
        style={{
          position: 'relative',
          height: 'inherit',
          overflow: 'hidden',
          paddingTop: theme.spacing(3),
        }}
      >
        <canvas
          ref={canvasRef}
          id='stock-price-chart'
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

const PriceDisplay = ({
  symbol,
  isSuccess,
  rangeData,
  hoverRangeData,
}: { symbol: string; isSuccess: boolean } | any) => {
  const [state, setState] = React.useState<{
    isLoading: boolean
    quote?: any
  }>({
    isLoading: true,
  })

  React.useEffect(() => {
    const es = new EventSource(`http://localhost:8001/sse/stock/quote?symbols=${symbol}`)

    es.onerror = () => {
      es.close()
    }

    const handleData = ({ data }: MessageEvent) => {
      setState({
        isLoading: false,
        quote: JSON.parse(data)[0],
      })
    }

    es.addEventListener('message', handleData)
    return () => {
      es.removeEventListener('message', handleData)
      es.close()

      setState({ isLoading: true })
    }
  }, [symbol])

  return (
    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h2' component='h4'>
        {state.isLoading ? (
          <Skeleton width='15%' />
        ) : (
          currency(hoverRangeData.price || state.quote.latestPrice)
        )}
      </Typography>
      <div style={{ minHeight: 50 }}>
        {state.isLoading ? (
          <Typography variant='body1'>
            <Skeleton width='15%' />
          </Typography>
        ) : (
          isSuccess && (
            <div style={{ display: 'flex' }}>
              <Typography variant='body1' style={{ marginRight: 4 }}>
                {currency(
                  hoverRangeData.change || rangeData.change || state.quote.change
                )}
              </Typography>
              <Typography variant='body1' component='h5'>
                {`(${percent(
                  hoverRangeData.changePercent ||
                    rangeData.changePercent ||
                    state.quote.changePercent
                )}) ${getRangeTitle(rangeData.range)}`}
              </Typography>
            </div>
          )
        )}
        {!state.isLoading &&
          state.quote.extendedChange &&
          !hoverRangeData.price &&
          rangeData.range === '1d' && (
            <div style={{ display: 'flex' }}>
              <Typography variant='body1' component='h5' style={{ marginRight: 4 }}>
                {currency(state.quote.extendedChange)}
              </Typography>
              <Typography variant='body1' component='h5'>
                {`(${percent(state.quote.extendedChangePercent)})`}
              </Typography>
            </div>
          )}
      </div>
    </div>
  )
}

type PriceDisplayAndChartProps = {
  theme: Theme
  symbol: string
  isSuccess: boolean
  rangeData: {
    range: Range
    data: any[]
    firstPrice: number | undefined
    change: number | undefined
    changePercent: number | undefined
  }
}

const getFirstPrice = (data: any[]): number | undefined => {
  const firstElement = data.find(element => element && element.y)
  if (firstElement) {
    return firstElement.y
  }

  return undefined
}

const formatData = (data: any[], range: Range): any[] => {
  // if (range === '1d' && data.length < 78) {
  //   const firstDate = new Date(`${data[0].date} ${data[0].minute}`)
  //   const newData = [...new Array(78)].map((_, index) => {
  //     return {
  //       y: data[index] ? data[index].average : null,
  //       x: new Date(firstDate.getTime() + index * 1000 * 60 * 5),
  //     }
  //   })

  //   return newData
  // }

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

const PriceDisplayAndChart = ({
  theme,
  symbol,
  isSuccess,
  rangeData,
}: PriceDisplayAndChartProps) => {
  const [hoverRangeData, setHoverRangeData] = React.useState<any>({})

  return (
    <>
      <PriceDisplay
        symbol={symbol}
        isSuccess={isSuccess}
        rangeData={rangeData}
        hoverRangeData={hoverRangeData}
      />
      <div style={{ height: 250, marginBottom: 16 }}>
        {isSuccess && (
          <PriceChart
            theme={theme}
            rangeData={rangeData}
            setHoverRangeData={setHoverRangeData}
          />
        )}
      </div>
    </>
  )
}

type Range = '1d' | '5d' | '1m' | '3m' | '1y'

const ranges: Range[] = ['1d', '5d', '1m', '3m', '1y']

export default ({ theme, symbol }: { theme: Theme; symbol: string }) => {
  const [selectedRange, setSelectedRange] = React.useState(ranges[0])
  const { isSuccess, data: rangeData } = useQuery<any, Error>({
    queryKey: `/stock/${symbol}/chart/${selectedRange}`,
    cacheTime: 1000 * 30,
    select: ({ data }) => {
      const chartData = formatData(data, selectedRange)
      console.log(chartData)
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

  // const isSuccess = a && !!''

  return (
    <Container disableGutters maxWidth={false}>
      <PriceDisplayAndChart
        theme={theme}
        symbol={symbol}
        isSuccess={isSuccess}
        rangeData={rangeData || {}}
      />
      <div>
        {ranges.map(range => (
          <Button
            key={range}
            // size='small'
            disabled={!isSuccess}
            var
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
