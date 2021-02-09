import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { PATHS } from './Routes'

export const isLogined = async () => {
  // let isLoggedIn = false
  return true
  // return await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN, {
  //   method: 'GET',
  //   mode: 'no-cors',
  // })
  //   .then((resp) => {
  //     console.log(resp)
  //     if (resp.status !== 200) {
  //       isLoggedIn = false
  //       resp.json()
  //     } else {
  //       resp.json()
  //     }
  //   })
  //   .then((data) => {
  //     data
  //   })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  return (
    <Route
      {...rest}
      sensitive
      render={(props) => (isLogined() ? <Component {...props} /> : <Redirect push to={PATHS.LOGIN_PAGE} />)}
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

  return <Route {...rest} render={(props) => (!isLogined() ? <Component {...props} /> : <Redirect push to="/" />)} />
}
