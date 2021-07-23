import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { SetIsJcrc } from '../store/facilityBooking/action'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading, setIsLoggedIn } from '../store/route/action'
import { RootState } from '../store/types'

const getIsLoggedIn = async () => {
  const dispatch = useDispatch()
  const token = localStorage.token
  const userId = localStorage.getItem('userID')
  if (userId === 'RH_JCRC') {
    dispatch(SetIsJcrc(true))
  }
  if (token) {
    dispatch(setIsLoading(true))
    await fetch(DOMAIN_URL.AUTH + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
      method: 'GET',
      mode: 'cors',
    })
      .then((resp) => {
        if (resp.ok) {
          dispatch(setIsLoading(false))
          dispatch(setIsLoggedIn(true))
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('userID')
          dispatch(setIsLoading(false))
          dispatch(setIsLoggedIn(false))
          throw resp
        }
      })
      .catch(() => {
        dispatch(setIsLoading(false))
        dispatch(setIsLoggedIn(false))
      })
  }
  dispatch(setIsLoading(false))
  dispatch(setIsLoggedIn(false))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  const { isLoading, isLoggedIn } = useSelector((state: RootState) => state.route)

  useEffect(() => {
    getIsLoggedIn()
  }, [getIsLoggedIn])

  if (localStorage.token) {
    return isLoading ? (
      <></>
    ) : isLoggedIn ? (
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
  const { isLoading, isLoggedIn } = useSelector((state: RootState) => state.route)

  useEffect(() => {
    getIsLoggedIn()
  }, [getIsLoggedIn])

  if (localStorage.token) {
    return isLoading ? (
      <></>
    ) : isLoggedIn ? (
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
