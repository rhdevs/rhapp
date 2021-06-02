import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'

const getIsLoggedIn = async () => {
  const token = localStorage.token
  if (process.env.REACT_APP_MODE == 'development') {
    localStorage.setItem('token', 'fuck')
    localStorage.setItem('userID', 'A1234567B')
    return true
  } else {
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  if (process.env.REACT_APP_MODE == 'development') {
    localStorage.setItem('token', 'fuck')
    localStorage.setItem('userID', 'A1234567B')
    return <Route {...rest} render={(props) => <Component {...props} />} />
  } else {
    if (localStorage.token) {
      return getIsLoggedIn() ? (
        <Route {...rest} render={(props) => <Component {...props} />} />
      ) : (
        <Route {...rest} render={() => <Redirect push to="/auth/login" />} />
      )
    } else {
      return (
        <Route
          {...rest}
          render={(props) => {
            console.log(props.location)
            return <Redirect push to={{ pathname: '/auth/login', state: { from: props.location.pathname } }} />
          }}
        />
      )
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

type StateType = {
  from: { pathname: string }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthenticateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  if (localStorage.token) {
    return getIsLoggedIn() ? (
      <Route
        {...rest}
        render={(props) => {
          const state = props.location.state as StateType
          const redirectUrl = state.from ?? '/'
          return <Redirect push to={redirectUrl} />
        }}
      />
    ) : (
      <Route {...rest} render={(props) => <Component {...props} />} />
    )
  } else {
    return <Route {...rest} render={(props) => <Component {...props} />} />
  }
}
