import { useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import Chart from 'chart.js'
import Typography from '@material-ui/core/Typography'

const RatingsChart = ({ theme, symbol }) => {
  const { isPlaceholderData, data } = useQuery(`/stock/recommendation?symbol=${symbol}`, {
    placeholderData: [],
  })

  const canvasRef = useRef()
  const chartRef = useRef()

  const options = useRef({
    type: 'horizontalBar',
    data: {
      labels: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
      datasets: [
        {
          data,
          barPercentage: 0.2,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main,
        },
      ],
    },
    options: {
      events: null,
      maintainAspectRatio: false,
      animation: 0,
      responsiveAnimationDuration: 0,
      hover: { mode: null },
      tooltips: { enabled: false },
      // data: { backgroundColor: 'red' },
      legend: { display: false },

      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            scaleLabel: {
              display: false,
            },
            ticks: {
              padding: theme.spacing(3),
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            scaleLabel: {
              display: false,
            },
            ticks: {
              display: false,
              beginAtZero: true,
              mirror: true,
            },
          },
        ],
      },
      layout: {
        padding: {
          left: 0,
        },
      },
    },
  })

  useEffect(() => {
    if (!chartRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      chartRef.current = new Chart(ctx, options.current)
    } else if (!isPlaceholderData) {
      options.current.data.datasets[0].data = [
        data[0].strongBuy,
        data[0].buy,
        data[0].hold,
        data[0].sell,
        data[0].strongSell,
      ]

      chartRef.current.update()
    }
  }, [isPlaceholderData, data])

  return (
    <div style={{ marginBottom: 16 }}>
      <Typography variant='h5' component='h2' paragraph>
        Analyst Recommendations
      </Typography>
      <div style={{ position: 'relative', height: 160 }}>
        <canvas id='ratings-chart' ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default RatingsChart
