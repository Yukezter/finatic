import React from 'react'
import Chart from 'chart.js'

const Sparkline = () => {
  const canvasRef = React.useRef()
  const chartRef = React.useRef()

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 64, 0, 0)

    gradient.addColorStop(1, 'rgba(251,196,9,0.2)')
    gradient.addColorStop(0.7, 'rgba(251,196,9,0.1)')
    gradient.addColorStop(0.5, 'rgba(251,196,9,0)')

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            fill: true,
            backgroundColor: gradient,
            borderColor: '#fdc600',
            borderWidth: 1,
            pointRadius: 0,
            lineTension: 0.1,
            data: [435, 321, 532, 801, 628, 972, 732, 543, 451, 582, 513, 700],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
      },
    })
  }, [])

  return <canvas id='sparklineChart' ref={canvasRef}></canvas>
}

export default Sparkline
