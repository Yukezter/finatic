import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

import { Wrapper, Link } from '../Components'

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
          <Box display='flex' alignItems='center' mb={1}>
            <Link
              href='https://github.com/yukezter'
              targetBlank
              color='primary'
              sx={{
                ml: 'auto',
                ':hover': {
                  color: theme => theme.palette.primary.dark,
                },
              }}
            >
              <GitHubIcon style={{ height: 30, width: 30 }} color='inherit' />
            </Link>
            <Link
              href='https://www.linkedin.com/in/bryan-hinchliffe'
              targetBlank
              color='primary'
              sx={{
                ml: 1,
                ':hover': {
                  color: theme => theme.palette.primary.dark,
                },
              }}
            >
              <LinkedInIcon style={{ height: 34, width: 34 }} color='inherit' />
            </Link>
          </Box>
          <Typography variant='caption' sx={{ color: theme => theme.palette.text.disabled }}>
            <b>Disclaimer</b>: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vestibulum id neque facilisis, commodo enim quis, facilisis ex. Aliquam quis
            fermentum sapien, get pharetra leo. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia curae; In auctor bibendum erat vitae
            pellentesque.
          </Typography>
        </Grid>
      </Grid>
    </Wrapper>
  )
}
