/* eslint-disable no-nested-ternary */
import React from 'react'
import { useQueries } from 'react-query'
import { styled, createStyles, Theme } from '@mui/material/styles'
import { alpha } from '@mui/material'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import 'chartjs-adapter-date-fns'
import {
  Chart,
  ScatterController,
  PointElement,
  TimeSeriesScale,
  Legend,
  ChartConfiguration,
  ChartItem,
  LegendItem,
  ChartOptions,
  PluginOptionsByType,
  Plugin,
  LegendOptions,
} from 'chart.js'
import { DeepPartial } from 'chart.js/types/utils'

Chart.register(ScatterController, PointElement, TimeSeriesScale, Legend)

const PREFIX = 'EarningsChart'

const classes = {
  root: `${PREFIX}-root`,
  chart: `${PREFIX}-chart`,
  canvas: `${PREFIX}-canvas`,
  legend: `${PREFIX}-legend`,
}

const Root = styled('div')(({ theme }) =>
  createStyles({
    [`&.${classes.root}`]: {},
    [`& .${classes.chart}`]: {
      position: 'relative',
      height: 200,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        height: 280,
      },
    },
    [`& .${classes.canvas}`]: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    [`& .${classes.legend}`]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      '& ul': {
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
      },
      '& li': {
        display: 'flex',
        flexDirection: 'column',
        marginRight: theme.spacing(2),
        '& div': {
          display: 'flex',
          alignItems: 'center',
        },
      },
      '& li:last-of-type': {
        marginRight: 0,
      },
      '& p': {
        ...theme.typography.body2,
        margin: 0,
        marginRight: theme.spacing(1.5),
      },
      '& .legend-label': {
        color: theme.palette.primary.main,
        whiteSpace: 'nowrap',
      },
      '& .legend-value': {
        color: theme.palette.text.secondary,
      },
      '& span': {
        display: 'inline-block',
        height: theme.spacing(1.5),
        width: theme.spacing(1.5),
        borderRadius: '50%',
      },
    },
  })
)

type DataPoint = {
  y: number | null
  x: number
}

type PluginOptions = Required<
  DeepPartial<
    PluginOptionsByType<'scatter'> & {
      legend: Required<LegendOptions<'scatter'>>
      htmlLegend: {
        containerID: string
        upcomingEarningsDate?: string
      }
    }
  >
>

type EarningsChartType = Chart<'scatter', DataPoint[]>

const getOrCreateLegendList = (id: string) => {
  const legendContainer = document.getElementById(id) as HTMLElement
  let listContainer = legendContainer.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')
    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

export default ({ symbol, theme }: { symbol: string; theme: Theme }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const chartRef = React.useRef<EarningsChartType>()

  const legendPlugin: Plugin<
    'scatter',
    { containerID: string; upcomingEarningsDate?: string }
  > = React.useMemo(
    () => ({
      id: 'htmlLegend',
      afterUpdate: (chart, _, { containerID, upcomingEarningsDate }) => {
        const ul = getOrCreateLegendList(containerID)

        while (ul.firstChild) {
          ul.firstChild.remove()
        }

        const legend = chart!.options!.plugins!.legend as Required<LegendOptions<'scatter'>>
        const items: LegendItem[] = legend.labels.generateLabels(chart)

        items.forEach(item => {
          const li = document.createElement('li')

          const div = document.createElement('div')

          const labelTextContainer = document.createElement('p')
          labelTextContainer.className += ' legend-label'

          const labelText = document.createTextNode(item.text)
          labelTextContainer.appendChild(labelText)
          div.appendChild(labelTextContainer)

          const valueTextContainer = labelTextContainer.cloneNode() as HTMLParagraphElement
          valueTextContainer.className += ' legend-value'

          const estimateEPSDataPoints = chart.data.datasets[0].data as DataPoint[]

          const itemValue =
            item.datasetIndex === 0
              ? String(estimateEPSDataPoints[estimateEPSDataPoints.length - 1].y || '-')
              : upcomingEarningsDate !== undefined
              ? `Available on ${upcomingEarningsDate}`
              : '-'

          const valueText = document.createTextNode(itemValue)
          valueTextContainer.appendChild(valueText)

          const boxSpan = document.createElement('span')
          boxSpan.style.borderColor = item.strokeStyle as string
          boxSpan.style.borderWidth = `${item.lineWidth}px` as string
          boxSpan.style.background =
            item.datasetIndex === 0
              ? alpha(theme.palette.primary.main, 0.5)
              : theme.palette.primary.main

          div.appendChild(boxSpan)

          li.appendChild(div)
          li.appendChild(valueTextContainer)
          ul.appendChild(li)
        })
      },
    }),
    []
  )

  const makeDefaultDataPoints = React.useCallback(() => {
    return Array.from(new Array(5)).map((_, index) => ({
      y: null,
      x: index,
    }))
  }, [])

  interface EarningsChartConfiguration extends ChartConfiguration<'scatter', DataPoint[]> {
    options: DeepPartial<
      ChartOptions<'scatter'> & {
        plugins: PluginOptions
      }
    >
  }

  const config = React.useMemo<EarningsChartConfiguration>(
    () => ({
      plugins: [legendPlugin],
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Estimate EPS',
            data: makeDefaultDataPoints(),
            pointRadius: 8,
            pointBackgroundColor: alpha(theme.palette.primary.main, 0.5),
            pointBorderWidth: 0,
          },
          {
            label: 'Actual EPS',
            data: makeDefaultDataPoints(),
            pointRadius: 8,
            pointBackgroundColor: theme.palette.primary.main,
            pointBorderWidth: 0,
          },
        ],
      },
      options: {
        events: [],
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          htmlLegend: {
            containerID: 'legend-container',
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            offset: true,
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              maxTicksLimit: 5,
              color: theme.palette.text.secondary,
              font: {
                family: theme.typography.body2.fontFamily,
                size: 15,
              },
            },
          },
          x: {
            offset: true,
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              padding: 16,
              stepSize: 1,
              minRotation: 0,
              maxRotation: 0,
              color: theme.palette.text.secondary,
              font: {
                family: theme.typography.body2.fontFamily,
                size: 14,
              },
            },
          },
        },
      },
    }),
    []
  )

  React.useEffect(() => {
    const chart = chartRef.current
    if (chart) {
      chart.options.scales!.y!.ticks!.color = theme.palette.text.secondary
      chart.options.scales!.x!.ticks!.color = theme.palette.text.secondary
      chart.update()
    }
  }, [theme])

  React.useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')
    const chart = new Chart(ctx as ChartItem, config)
    chartRef.current = chart

    return () => {
      chart.destroy()
    }
  }, [])

  const queries = useQueries([
    {
      queryKey: `/stock/${symbol}/past-earnings`,
    },
    {
      queryKey: `/stock/${symbol}/upcoming-earnings`,
    },
  ])

  const isSuccess = queries.every(query => query.isSuccess)

  React.useEffect(() => {
    if (isSuccess) {
      const labels: string[] = []
      const estimateEPSDataPoints = chartRef.current!.data.datasets[0].data
      const actualEPSDataPoints = chartRef.current!.data.datasets[1].data

      /* Past 4 earnings reports */
      const { earnings: pastEarnings = [] } = queries[0].data as any

      Array.from(new Array(4)).forEach((_, index: number) => {
        const { fiscalPeriod, consensusEPS, actualEPS } = pastEarnings[index] || {}

        labels.unshift(fiscalPeriod || null)
        estimateEPSDataPoints[3 - index].y = consensusEPS || null
        actualEPSDataPoints[3 - index].y = actualEPS || null
      })

      /* Next earnings report */
      const nextEarnings = (queries[1].data as any) || []
      const { fiscalPeriod, consensusEPS, reportDate } = nextEarnings[0] || {}

      labels.push(fiscalPeriod || null)
      estimateEPSDataPoints[estimateEPSDataPoints.length - 1].y = consensusEPS || null

      const plugins = chartRef.current!.options!.plugins as PluginOptions

      if (reportDate) {
        plugins.htmlLegend.upcomingEarningsDate = format(new Date(reportDate), 'MMM, yy')
      }

      chartRef.current!.options.scales!.x!.ticks!.callback = (tick, index) => {
        return labels[index]
      }

      // chartRef.current!.options.onResize = (chart, size) => {
      //   console.log(chart.width)
      // }

      chartRef.current!.update()
    }
  }, [isSuccess])

  return (
    <Root className={classes.root}>
      <Typography variant='h5' component='h4' gutterBottom>
        Earnings
      </Typography>
      <div>
        <div className={classes.chart}>
          <canvas className={classes.canvas} ref={canvasRef} id='earnings-chart' />
        </div>
        <legend id='legend-container' className={classes.legend} />
      </div>
    </Root>
  )
}
