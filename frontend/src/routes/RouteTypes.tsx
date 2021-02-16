import React from 'react'
// import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
// import { RootState } from '../store/types'
// import { PATHS } from './Routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrivateRoute = (routeProps: any) => {
  // const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  const { component: Component, ...rest } = routeProps
  // return (
  // <Route
  //   {...rest}
  //   sensitive
  //   render={(props) =>
  //     isLoggedIn && localStorage.token ? <Component {...props} /> : <Redirect push to={PATHS.LOGIN_PAGE} />
  //   }
  // />
  // )

  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PublicRoute = (routeProps: any) => {
  const { component: Component, ...rest } = routeProps
  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthenticateRoute = (routeProps: any) => {
  // const { isLoggedIn } = useSelector((state: RootState) => state.profile)

  const { component: Component, ...rest } = routeProps
  // return (
  //   <Route
  //     {...rest}
  //     render={(props) => (!isLoggedIn && !localStorage.token ? <Component {...props} /> : <Redirect push to="/" />)}
  //   />
  // )

  return <Route {...rest} sensitive render={(props) => <Component {...props} />} />
}
