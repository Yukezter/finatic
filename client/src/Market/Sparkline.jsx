import React from 'react'
import Chart from 'chart.js'

const labels = new Array(390 / 10).fill(null)

const updateData = data => {
  return data.reduce((acc, curr, idx) => {
    acc[idx] = curr
    return acc
  }, labels)
}

const Sparkline = ({ labels, data }) => {
  const canvasRef = React.useRef()
  const chartRef = React.useRef()

  React.useEffect(() => {
    if (!chartRef.current) {
      const ctx = canvasRef.current.getContext('2d')

      const gradient = ctx.createLinearGradient(0, 64, 0, 0)

      gradient.addColorStop(1, 'rgba(251,196,9,0.2)')
      gradient.addColorStop(0.7, 'rgba(251,196,9,0.1)')
      gradient.addColorStop(0.5, 'rgba(251,196,9,0)')

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              fill: true,
              backgroundColor: gradient,
              borderColor: '#fdc600',
              borderWidth: 1,
              pointRadius: 0,
              lineTension: 0.1,
              data: updateData(data),
            },
          ],
        },
        options: {
          events: null,
          maintainAspectRatio: false,
          spanGaps: true,
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
    } else {
      chartRef.current.data.datasets[0].data = updateData(data)
    }
  }, [labels, data])

  return <canvas id='sparklineChart' ref={canvasRef}></canvas>
}

export default Sparkline
