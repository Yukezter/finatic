import React from 'react'
import Chart from 'chart.js'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(18),
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(16),
    },
    [theme.breakpoints.up('lg')]: {
      height: theme.spacing(18),
    },
  },
  doughnutTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  doughnutLabel: {
    fontWeight: 800,
    maxWidth: '60%',
    margin: '0 auto',
  },
  doughnutData: {
    fontWeight: 700,
    marginRight: 4,
  },
}))

const DoughnutChart = ({ data }) => {
  const canvasRef = React.useRef()
  const chartRef = React.useRef()

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [data, 100 - data],
            backgroundColor: ['#fdc600', '#e8e8e8'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        cutoutPercentage: 85,
        rotation: Math.PI,
        circumference: Math.PI,
        tooltips: {
          enabled: false,
        },
        hover: {
          mode: null,
        },
      },
    })
  }, [data])

  return <canvas id='doughnutChart' ref={canvasRef}></canvas>
}

const Doughnut = ({ data }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <DoughnutChart data={data} />
      <div className={classes.doughnutTextContainer}>
        <Typography
          classes={{ root: classes.doughnutLabel }}
          variant='body2'
          align='center'
        >
          US Recession Probabilities
        </Typography>
        <div>
          <Typography classes={{ root: classes.doughnutData }} variant='h4'>
            {data}
          </Typography>
          <Typography variant='h6'>%</Typography>
        </div>
      </div>
    </div>
  )
}

export default Doughnut
