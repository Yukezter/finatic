/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import createStyles from '@mui/styles/createStyles'
import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import { SnackbarProvider } from 'notistack'

import Header from './Header'
import Footer from './Footer'
import { LogoIcon } from '../Icons'
import { Wrapper } from '../Components'
import { Market, News, Company, NotFound } from '../Pages'

const styles = withStyles(theme =>
  createStyles({
    root: {
      height: 'auto',
      minHeight: '100vh',
      paddingTop: 56,
      display: 'flex',
      flexDirection: 'column',
    },
    info: {
      backgroundColor: `${theme.palette.info.main} !important`,
    },
    loadingBackdropLogo: {
      borderRadius: '50%',
      transform: 'scale(1)',
      // boxShadow: '0 0 0 0 rgba(255, 255, 255, 1)',
      animation: `$pulse 2s infinite`,
    },
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.93)',
        // boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)',
      },
      '70%': {
        transform: 'scale(1)',
        // boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)',
      },
      '100%': {
        transform: 'scale(0.93)',
        // boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)',
      },
    },
  })
)

const InitialLoadingBackdrop = ({ open, classes }: { open: boolean; classes: any }) => (
  <Backdrop
    open={open}
    appear={false}
    sx={{
      background: theme => theme.palette.primary.main,
      zIndex: 2000,
      overflow: 'hidden',
    }}
  >
    <Box display='flex' alignItems='center'>
      <LogoIcon
        className={classes.loadingBackdropLogo}
        title='Finatic logo'
        height={72}
        width={72}
      />
    </Box>
  </Backdrop>
)

const App = styles(({ isLoading, classes }: any) => {
  const theme = useTheme()

  return (
    <>
      <InitialLoadingBackdrop classes={classes} open={isLoading} />
      {!isLoading && (
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate
          classes={{
            variantInfo: classes.info,
          }}
        >
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
                <Route path='/' exact>
                  <Redirect to='/market' />
                </Route>
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
        </SnackbarProvider>
      )}
    </>
  )
})

export default App
