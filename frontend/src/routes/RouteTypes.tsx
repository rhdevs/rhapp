import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { PROFILE_ACTIONS } from '../store/profile/types'
import { RootState } from '../store/types'
import { PATHS } from './Routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  const dispatch = useDispatch()
  const { component: Component, ...rest } = routeProps

  const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  const checkIsLoggedIn = async () => {
    const token = localStorage.token
    if (token && !isLoggedIn) {
      await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
        method: 'GET',
        mode: 'no-cors',
      }).then((resp) => {
        console.log(resp)
        if (resp.status !== 200) {
          dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: true })
        } else {
          dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
        }
      })
    } else {
      console.log('notoken sob')
      dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
    }
  }

  useEffect(() => {
    checkIsLoggedIn()
  }, [isLoggedIn])

  return (
    <Route
      {...rest}
      sensitive
      render={(props) =>
        isLoggedIn && localStorage.token ? <Component {...props} /> : <Redirect push to={PATHS.LOGIN_PAGE} />
      }
      // render={(props) => <Component {...props} />}
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
  const { component: Component, ...rest } = routeProps

  const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  const checkIsLoggedIn = async () => {
    const token = localStorage.token
    if (token && !isLoggedIn) {
      await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
        method: 'GET',
        mode: 'no-cors',
      }).then((resp) => {
        console.log(resp)
        if (resp.status !== 200) {
          dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: true })
        } else {
          dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
        }
      })
    } else {
      console.log('notoken sob')
      dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
    }
  }

  useEffect(() => {
    checkIsLoggedIn()
  }, [isLoggedIn])

  return (
    <Route
      {...rest}
      render={(props) => (!isLoggedIn && !localStorage.token ? <Component {...props} /> : <Redirect push to="/" />)}
    />
  )
}
