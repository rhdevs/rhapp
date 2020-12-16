import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'
// import { ConfigManager } from '~/common/ConfigManager'

// import { PrivateRoute, PublicRoute, AuthenticateRoute } from './shared'
// import RouteHooks from './RouteHooks'

export enum PATHS {
  HOME_PAGE = '/',
  SIGNUP_PAGE = '/signup',
}

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))

export default class Routes extends React.Component {
  render() {
    return (
      <Root>
        {/* <RouteHooks />
        <Suspense fallback={loadingIcon}>
          <GlobalFlows />
        </Suspense> */}
        <Suspense fallback={LoadingSpin}>
          <Switch>
            <Route exact path={PATHS.HOME_PAGE} component={Home} />
          </Switch>
        </Suspense>
      </Root>
    )
  }
}

const Root = styled.div`
  z-index: 0;
`
