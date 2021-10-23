/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { AxiosResponse } from 'axios'
import { useQueries, UseQueryResult } from 'react-query'
import { format } from 'date-fns'
import { styled, createStyles, Theme } from '@mui/material/styles'
import {
  Chart,
  ScatterController,
  PointElement,
  TimeSeriesScale,
  Legend,
  ChartConfiguration,
  ChartItem,
  LegendItem,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { alpha } from '@mui/material'
import Typography from '@mui/material/Typography'

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
    },
  })
)

const getOrCreateLegendList = (chart: Chart, id: string) => {
  const legendContainer = document.getElementById(id) as HTMLElement
  let listContainer = legendContainer.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')
    listContainer.style.display = 'flex'
    listContainer.style.flexDirection = 'row'
    listContainer.style.margin = '0'
    listContainer.style.padding = '0'

    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

export default ({ symbol, theme }: { symbol: string; theme: Theme }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const chartRef = React.useRef<Chart>()

  const nextEarningsDateRef = React.useRef<string>()

  const legendPlugin = React.useMemo(
    () => ({
      id: 'htmlLegend',
      afterUpdate: (chart: any, args: any, options: any) => {
        const ul = getOrCreateLegendList(chart, options.containerID)

        while (ul.firstChild) {
          ul.firstChild.remove()
        }

        const items: LegendItem[] =
          chart.options!.plugins!.legend!.labels!.generateLabels(chart)

        items.forEach(item => {
          const li = document.createElement('li')
          li.style.display = 'flex'
          li.style.flexDirection = 'column'
          li.style.padding = '16px'

          const pointColor =
            item.datasetIndex === 0
              ? alpha(theme.palette.primary.main, 0.5)
              : theme.palette.primary.main

          const div = document.createElement('div')
          div.style.display = 'flex'
          div.style.alignItems = 'center'

          // Text
          const labelTextContainer = document.createElement('p')
          labelTextContainer.style.fontSize = theme.typography.body2.fontSize as string
          labelTextContainer.style.color = theme.palette.text.secondary as string
          labelTextContainer.style.margin = '0'
          labelTextContainer.style.padding = '0'
          labelTextContainer.style.marginRight = '12px'

          const valueTextContainer = labelTextContainer.cloneNode()
          labelTextContainer.style.color = theme.palette.primary.main as string
          labelTextContainer.style.fontWeight = theme.typography
            .fontWeightMedium as string

          const labelText = document.createTextNode(item.text)
          labelTextContainer.appendChild(labelText)
          div.appendChild(labelTextContainer)

          const itemValue =
            item.datasetIndex === 0
              ? '-'
              : nextEarningsDateRef.current
              ? `Available on ${nextEarningsDateRef.current}`
              : '-'
          const valueText = document.createTextNode(itemValue)
          valueTextContainer.appendChild(valueText)

          // Color point
          const boxSpan = document.createElement('span')
          boxSpan.style.background = pointColor
          boxSpan.style.borderColor = item.strokeStyle as string
          boxSpan.style.borderWidth = `${item.lineWidth}px` as string
          boxSpan.style.display = 'inline-block'
          boxSpan.style.height = '12px'
          boxSpan.style.width = '12px'
          boxSpan.style.borderRadius = '50%'
          div.appendChild(boxSpan)

          li.appendChild(div)
          li.appendChild(valueTextContainer)
          ul.appendChild(li)
        })
      },
    }),
    []
  )

  const configRef = React.useRef<ChartConfiguration | any>({
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Estimate EPS',
          data: [],
          pointRadius: 8,
          pointBackgroundColor: alpha(theme.palette.primary.main, 0.5),
          pointBorderWidth: 0,
        },
        {
          label: 'Actual EPS',
          data: [],
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
          reverse: true,
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
    plugins: [legendPlugin],
  })

  React.useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')
    const chart = new Chart(ctx as ChartItem, configRef.current)
    chartRef.current = chart

    return () => {
      chart.destroy()
    }
  }, [])

  const queries = useQueries([
    {
      queryKey: `/stock/${symbol}/earnings`,
    },
    {
      queryKey: `/stock/${symbol}/upcoming-earnings`,
    },
  ])

  const isLoading = queries.some(query => !query.isSuccess)

  React.useEffect(() => {
    if (!isLoading) {
      const labels: string[] = []
      const estimate: any[] = []
      const actual: any[] = []

      const earningsResponse = queries[0].data as any
      earningsResponse.data.earnings.forEach((report: any, index: number) => {
        labels.unshift(report.fiscalPeriod)

        estimate.push({
          x: index,
          y: report.consensusEPS,
        })

        actual.push({
          x: index,
          y: report.actualEPS,
        })
      })

      const upcomingEarningsResponse = queries[1].data as any
      nextEarningsDateRef.current = format(
        new Date(upcomingEarningsResponse.data[0].reportDate),
        'MMM, yy'
      )

      chartRef.current!.data.datasets[0].data = estimate
      chartRef.current!.data.datasets[1].data = actual
      chartRef.current!.options.scales!.x!.ticks!.callback = (_, index) => {
        return labels[index]
      }

      chartRef.current!.update()
    }
  }, [isLoading])

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
