import React from 'react'
import Chart from 'chart.js'
import Typography from '@material-ui/core/Typography'

const Doughnut = ({ percentage }) => {
  const canvasRef = React.useRef()
  const chartRef = React.useRef()

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: ['#fdc600', '#e8e8e8'],
            // borderColor: 'transparent',
            // borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 0,
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        responsiveAnimationDuration: false,
        cutoutPercentage: 70,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        tooltips: {
          enabled: false,
        },
        hover: {
          mode: null,
        },
      },
    })
  }, [percentage])

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <canvas id='doughnut-chart' ref={canvasRef}></canvas>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            width: 'auto',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h4'>{percentage}%</Typography>
        </div>
      </div>
      <Typography variant='h6' align='center'>
        U.S. Recession Probability
      </Typography>
    </div>
  )
}

export default Doughnut
