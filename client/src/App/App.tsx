/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Route, RouteProps } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import createStyles from '@mui/styles/createStyles'
import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import { Wrapper } from '../Components'
import { Market, News, Company } from '../Pages'

const styles = withStyles(theme =>
  createStyles({
    root: {
      height: 'auto',
      paddingTop: 56,
    },
    Container: {
      paddingTop: theme.spacing(5),
    },
  })
)

const routes = [
  {
    path: '/',
    Component: () => <></>,
  },
  {
    path: '/news',
    Component: News,
  },
  {
    path: '/market',
    Component: Market,
  },
]

const App = styles(({ classes }: any) => {
  const theme = useTheme()
  return (
    <div className={classes.root}>
      <Header />
      <Container maxWidth={false}>
        <Wrapper className={classes.Container}>
          <Switch>
            {routes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                exact
                render={(props: RouteProps) => <Component {...props} theme={theme} />}
              />
            ))}
            <Route
              path='/company/:symbol'
              exact
              render={(props: RouteProps) => (
                <Company key={props.location!.key} {...props} theme={theme} />
              )}
            />
          </Switch>
        </Wrapper>
      </Container>
      <Footer />
    </div>
  )
})

export default App
