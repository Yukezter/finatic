import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
// import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

// const now = new Date()
// const open = zonedTimeToUtc('2021-11-11T09:30:00.000Z', 'America/New_York')
// const earlyClose = zonedTimeToUtc('2021-11-11T13:00:00.000Z', 'America/New_York')
// const close = zonedTimeToUtc('2021-11-11T16:00:00.000Z', 'America/New_York')
// const open = zonedTimeToUtc('2021-11-10 20:40', 'America/New_York')
// const est = utcToZonedTime(new Date(), 'America/New_York')
// console.log(est)
// console.log(est.getFullYear(), est.getMonth() + 1, est.getDate())
// const utc = zonedTimeToUtc(
//   `${est.getFullYear()}-${est.getMonth() + 1}-${est.getDate()} 14:49`,
//   'America/New_York'
// )
// console.log((utc.getTime() - new Date().getTime()) / 1000)
// const utc2 = zonedTimeToUtc('2021-11-11 14:42', 'America/New_York')
// console.log(utc2)
// setInterval(() => {
//   console.log(now > open.getTime())
// }, 3000)

// import { useQuotes } from '../Hooks'

// const symbols = ['AAPL', 'TSLA', 'UPST']

export default () => {
  // const { isLoading, data } = useQuotes(
  //   `/sse/stock/quote?symbols=${symbols.join(',')}`,
  //   symbols
  // )

  // console.log(isLoading, data)

  return (
    <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        mt={{ xs: '-20%', sm: 0 }}
      >
        <div>
          <Typography variant='h1' component='h1' color='primary'>
            404
          </Typography>
          <Divider variant='middle' sx={{ mb: 1 }} />
        </div>
        <Typography variant='h5' component='h2' maxWidth={280} align='center'>
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </Typography>
      </Box>
    </Box>
  )
}
