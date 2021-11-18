/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import createStyles from '@mui/styles/createStyles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'

import Header from './Header'
import Footer from './Footer'
import { LogoIcon } from '../Icons'
import { Wrapper } from '../Components'
import { Market, News, Company, NotFound } from '../Pages'

const styles = withStyles(() =>
  createStyles({
    root: {
      height: 'auto',
      minHeight: '100vh',
      paddingTop: 56,
      display: 'flex',
      flexDirection: 'column',
    },
  })
)

const InitialLoadingScreen = ({ open }: { open: boolean }) => (
  <Backdrop
    open={open}
    sx={{
      background: theme => theme.palette.primary.main,
      zIndex: 2000,
      overflow: 'hidden',
    }}
  >
    <Box display='flex'>
      <LogoIcon title='Finatic logo' height={40} width={40} style={{ marginRight: 8 }} />
      <Typography variant='h1'>Finatic</Typography>
    </Box>
  </Backdrop>
)

const App = styles(({ isLoading, classes }: any) => {
  const theme = useTheme()

  if (isLoading) {
    return <InitialLoadingScreen open={isLoading} />
  }

  return (
    <div className={classes.root}>
      {/* <InitialLoadingScreen open={isLoading} /> */}
      <Header />
      <Wrapper
        sx={{
          pt: { xs: 2, sm: 4 },
          pb: 8,
          flex: {
            xs: '1 1 calc(100vh - 56px)',
            sm: '1 1 auto',
          },
          display: 'flex',
        }}
      >
        <Switch>
          <Route path='/news' exact>
            <News />
          </Route>
          <Route path='/market' exact>
            <Market theme={theme} />
          </Route>
          <Route
            path='/company/:symbol'
            exact
            render={(props: RouteProps) => (
              <Company key={props.location!.key} {...props} theme={theme} />
            )}
          />
          <Route path='/404' exact component={NotFound} />
          <Route>
            <Redirect to='/404' />
          </Route>
        </Switch>
      </Wrapper>
      <Footer />
    </div>
  )
})

export default App
