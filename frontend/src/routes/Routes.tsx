import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'

export enum PATHS {
  // MAIN LANDING PAGE
  HOME_PAGE = '/',
  // AUTHENTICATION
  LOGIN_PAGE = '/login',
  SIGNUP_PAGE = '/signup',
  SCHEDULE_PAGE = '/schedule',
}

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))
const Signup = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Authentication/Signup'))
const Schedule = React.lazy(() => import(/* webpackChunckName: "Scheduling" */ './Schedule'))

export default class Routes extends React.Component {
  render() {
    return (
      <Root>
        <Suspense fallback={LoadingSpin}>
          <Switch>
            <Route exact path={PATHS.HOME_PAGE} component={Home} />
            <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
            <Route exact path={PATHS.SIGNUP_PAGE} component={Signup} />
            <Route exact path={PATHS.SCHEDULE_PAGE} component={Schedule} />
          </Switch>
        </Suspense>
      </Root>
    )
  }
}

const Root = styled.div`
  z-index: 0;
`
