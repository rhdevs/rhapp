import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { SetIsJcrc } from '../store/facilityBooking/action'

import LoadingSpin from '../components/LoadingSpin'

/**
 * # PrivateRoute
 * Verifies if user is logged in before rendering pages that require user log in.
 * 1. Check if user is logged in
 * 2. If user is logged in, render the component
 * 3. If user is not logged in, redirect to login page `auth/login`
 *
 * @param routeProps (any)
 * @example
 * ```
 * // in Routes.tsx
 * <PrivateRoute exact path={PATHS.HOME_PAGE} component={Home} />
 * ```
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const dispatch = useDispatch()
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null)
  const { component: Component, ...rest } = routeProps

  useEffect(() => {
    const getIsLoggedIn = async () => {
      const token = localStorage.token
      const userId = localStorage.getItem('userID')

      if (userId === 'RH_JCRC') dispatch(SetIsJcrc(true))

      if (token) {
        await fetch(DOMAIN_URL.AUTH + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
          method: 'GET',
          mode: 'cors',
        }).then((resp) => {
          if (resp.ok) {
            return setIsLoggedIn(true)
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('userID')
            return setIsLoggedIn(false)
          }
        })
      } else {
        return setIsLoggedIn(false)
      }
    }
    getIsLoggedIn()
  }, [])

  if (isLoggedIn === null) return <LoadingSpin />

  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn ? <Component {...props} /> : <Redirect to="auth/login" />
      }}
    />
  )
}

/**
 * # PublicRoute
 * Renders pages that do not require user log in.
 *
 * @param routeProps (any)
 * @example
 * ```
 * // in Routes.tsx
 * <PublicRoute exact path={PATHS.VIEW_FACILITY_BOOKING} component={ViewBooking} />
 * ```
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

type StateType = {
  from: { pathname: string }
}

/**
 * # AuthenticateRoute
 * Verifies if user is logged out before rendering log in page.
 * 1. Check if user is logged in
 * 2. If user is logged in, redirect to home page `/`
 * 3. If user is not logged in, render the component
 *
 * @param routeProps (any)
 * @example
 * ```
 * // in Routes.tsx
 * <AuthenticateRoute exact path={PATHS.LOGIN_PAGE} component={Login} />
 * ```
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthenticateRoute = (routeProps: any) => {
  const dispatch = useDispatch()
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null)
  const { component: Component, ...rest } = routeProps

  useEffect(() => {
    const getIsLoggedIn = async () => {
      const token = localStorage.token
      const userId = localStorage.getItem('userID')

      if (userId === 'RH_JCRC') dispatch(SetIsJcrc(true))

      if (token) {
        await fetch(DOMAIN_URL.AUTH + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
          method: 'GET',
          mode: 'cors',
        }).then((resp) => {
          if (resp.ok) {
            return setIsLoggedIn(true)
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('userID')
            return setIsLoggedIn(false)
          }
        })
      } else {
        return setIsLoggedIn(false)
      }
    }
    getIsLoggedIn()
  }, [])

  if (isLoggedIn === null) return <LoadingSpin />

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (isLoggedIn) {
          const state = props!.location.state as StateType
          const redirectUrl = state?.from ?? '/'
          return <Redirect push to={redirectUrl} />
        } else {
          return <Component {...props} />
        }
      }}
    />
  )
}
