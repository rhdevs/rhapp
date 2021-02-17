import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { checkIsLoggedIn } from '../store/profile/action'
import { RootState } from '../store/types'
import { PATHS } from './Routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkIsLoggedIn())
  }, [dispatch])

  const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  console.log(isLoggedIn)
  const { component: Component, ...rest } = routeProps
  return (
    <Route
      {...rest}
      sensitive
      render={(props) =>
        isLoggedIn && localStorage.token ? <Component {...props} /> : <Redirect push to={PATHS.LOGIN_PAGE} />
      }
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
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkIsLoggedIn())
  }, [dispatch])

  const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  const { component: Component, ...rest } = routeProps
  return (
    <Route
      {...rest}
      render={(props) => (!isLoggedIn && !localStorage.token ? <Component {...props} /> : <Redirect push to="/" />)}
    />
  )
}
