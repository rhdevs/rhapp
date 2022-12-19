import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// eslint-disable-next-line
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  if (localStorage.token) {
    return <Route {...rest} render={(props) => <Component {...props} />} />
  } else {
    return (
      <Route
        {...rest}
        render={(props) => {
          // eslint-disable-next-line
          return <Redirect push to={{ pathname: '/auth/login', state: { from: props.location.pathname } }} />
        }}
      />
    )
  }
}

// eslint-disable-next-line
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

type StateType = {
  from: { pathname: string }
}

// eslint-disable-next-line
export const AuthenticateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps

  if (localStorage.token) {
    return (
      <Route
        {...rest}
        render={(props) => {
          // eslint-disable-next-line
          const state = props.location.state as StateType
          const redirectUrl = state?.from ?? '/'
          return <Redirect push to={redirectUrl} />
        }}
      />
    )
  } else {
    return <Route {...rest} render={(props) => <Component {...props} />} />
  }
}
