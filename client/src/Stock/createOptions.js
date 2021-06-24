import tooltip from './tooltip'

const getPrices = data =>
  data.reduce((acc, curr) => {
    if (curr.y) acc.push(curr.y)
    return acc
  }, [])

const beforeLayout = chart => {
  const data = chart.data.datasets[0].data
  const yTicks = chart.options.scales.yAxes[0].ticks
  const prices = getPrices(data)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const buffer = (max - min) * 0.02
  yTicks.min = min - buffer
  yTicks.max = max + buffer
}

const afterDraw = theme => {
  return chart => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const activePoint = chart.controller.tooltip._active[0]
      const ctx = chart.ctx
      const x = activePoint.tooltipPosition().x
      const topY = chart.scales['y-axis-0'].top
      const bottomY = chart.scales['y-axis-0'].bottom
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)
      ctx.lineWidth = 1
      ctx.strokeStyle = theme.palette.text.hint
      ctx.stroke()
      ctx.restore()
    }
  }
}

export default (theme, data, handleChartHover) => {
  const { palette, spacing } = theme

  const options = {
    type: 'line',
    data: {
      datasets: [
        {
          data,
          fill: false,
          borderWidth: 3,
          borderColor: palette.primary.main,
          lineTension: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHoverBorderWidth: 2,
          hoverBorderColor: palette.background.default,
          backgroundColor: palette.primary.main,
          pointHitRadius: 10,
        },
      ],
    },
    options: {
      events: ['mousemove', 'mouseout', 'touchmove', 'touchend'],
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      responsiveAnimationDuration: 0,
      spanGaps: true,
      hover: {
        animationDuration: 0,
        mode: 'index',
        intersect: false,
        onHover: handleChartHover,
      },
      elements: {
        line: {
          tension: 0,
        },
      },
      legend: { display: false },
      tooltips: {
        mode: 'index',
        intersect: false,
        enabled: false,
        custom: tooltip(theme),
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            distribution: 'series',
            time: {
              tooltipFormat: 'h:mm A',
            },
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      layout: {
        padding: {
          top: spacing(3),
          left: spacing(0.75),
          right: spacing(0.75),
          bottom: 0,
        },
      },
    },
    plugins: [
      {
        id: 'set-y-range',
        beforeLayout,
      },
      {
        id: 'vertical-line',
        afterDraw: afterDraw(theme),
      },
    ],
  }

  return options
}
