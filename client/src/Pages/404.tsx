/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

export default () => {
  return (
    <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <div style={{ marginRight: 16 }}>
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
