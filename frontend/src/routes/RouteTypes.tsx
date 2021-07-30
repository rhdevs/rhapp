import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { SetIsJcrc } from '../store/facilityBooking/action'
import { useDispatch } from 'react-redux'

const getIsLoggedIn = async () => {
  const dispatch = useDispatch()
  const token = localStorage.token
  const userId = localStorage.getItem('userID')
  if (userId === 'RH_JCRC') {
    dispatch(SetIsJcrc(true))
  }
  if (token) {
    await fetch(DOMAIN_URL.AUTH + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
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
    return (
      <Route
        {...rest}
        render={(props) => {
          return <Redirect push to={{ pathname: '/auth/login', state: { from: props.location.pathname } }} />
        }}
      />
    )
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
          const redirectUrl = state?.from ?? '/'
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
