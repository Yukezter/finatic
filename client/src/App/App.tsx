/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Route, RouteProps } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import createStyles from '@mui/styles/createStyles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Header from './Header'
import Footer from './Footer'
import { Wrapper, Icon } from '../Components'
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

const InitialLoadingScreen = () => (
  <Box
    height='100vh'
    width='100vw'
    display='flex'
    justifyContent='center'
    alignItems='center'
    sx={{ background: theme => theme.palette.primary.main }}
  >
    <Box display='flex' alignItems='center'>
      <Icon name='logo' title='logo' height={48} width={48} style={{ marginRight: 8 }} />
      <Typography variant='h1'>Finatic</Typography>
    </Box>
  </Box>
)

const App = styles(({ isLoading, classes }: any) => {
  const theme = useTheme()

  if (isLoading) {
    return <InitialLoadingScreen />
  }

  return (
    <div className={classes.root}>
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
          <Route component={NotFound} />
        </Switch>
      </Wrapper>
      <Footer />
    </div>
  )
})

export default App
