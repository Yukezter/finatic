/* eslint-disable @typescript-eslint/no-unused-vars */
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'

import { Wrapper, Icon, Link } from '../Components'

export default () => {
  return (
    <Wrapper
      sx={{
        display: 'flex',
        pt: 6,
        pb: 3,
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container>
        <Grid item sm={12}>
          <Box display='flex' mb={2}>
            <Link
              href='https://github.com/yukezter'
              targetBlank
              color='primary'
              sx={{
                ':hover': {
                  color: theme => theme.palette.primary.dark,
                },
              }}
            >
              <GitHubIcon style={{ height: 34, width: 34 }} color='inherit' />
            </Link>
          </Box>
          <Typography variant='caption' sx={{ color: theme => theme.palette.text.disabled }}>
            Disclaimer: All data is delayed by 15 minutes or more depending on when the data
            was cached, except cryptocurrency, forex, and realtime intraday chart prices. The
            data is provided for informational purposes only and should not be used as the
            basis for share trading, as unintended inaccuracies, errors, or misprints may
            occur.
          </Typography>
        </Grid>
      </Grid>
    </Wrapper>
  )
}
