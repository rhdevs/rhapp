import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'

const getIsLoggedIn = async () => {
  const token = localStorage.token

  if (token) {
    await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
      method: 'GET',
      mode: 'cors',
    }).then((resp) => {
      if (resp.ok) {
        return true
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        return false
      }
    })
  } else {
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  if (localStorage.token) {
    return getIsLoggedIn() ? (
      <Route {...rest} render={(props) => <Component {...props} />} />
    ) : (
      <Route {...rest} render={() => <Redirect push to="/auth/login" />} />
    )
  } else {
    return <Route {...rest} render={() => <Redirect push to="/auth/login" />} />
  }
}

export const HomeRoute = (routeProps: any) => {
  const { ...rest } = routeProps

  const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
  const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))

  if (localStorage.token) {
    return getIsLoggedIn() ? <Route {...rest} component={Home} /> : <Route {...rest} component={Login} />
  } else {
    return <Route {...rest} component={Login} />
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthenticateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  if (localStorage.token) {
    return getIsLoggedIn() ? (
      <Route {...rest} render={() => <Redirect push to="/" />} />
    ) : (
      <Route {...rest} render={(props) => <Component {...props} />} />
    )
  } else {
    return <Route {...rest} render={(props) => <Component {...props} />} />
  }
}
