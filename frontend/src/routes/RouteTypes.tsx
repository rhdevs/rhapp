import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { PATHS } from './Routes'

export const isLoggedIn = () => {
  const token = localStorage.token
  console.log('checking is Logged In')
  return token ? true : false
  // if (token) {
  //   await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
  //     method: 'GET',
  //     mode: 'no-cors',
  //   }).then((resp) => {
  //     console.log(resp)
  //     if (resp.status !== 200) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   })
  // } else {
  //   return false
  // }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  console.log(isLoggedIn())
  return (
    <Route
      {...rest}
      sensitive
      render={(props) => (isLoggedIn() ? <Component {...props} /> : <Redirect push to={PATHS.LOGIN_PAGE} />)}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthenticateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  return <Route {...rest} render={(props) => (!isLoggedIn() ? <Component {...props} /> : <Redirect push to="/" />)} />
}
