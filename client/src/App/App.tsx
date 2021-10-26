/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Route, RouteProps } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
// import Divider from '@mui/material/Divider'
import createStyles from '@mui/styles/createStyles'

import Header from './Header'
import Footer from './Footer'
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

const App = styles(({ classes }: any) => {
  const theme = useTheme()
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
