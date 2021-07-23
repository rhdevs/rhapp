import { PATHS } from '../../routes/Routes'

export enum ROUTE_ACTIONS {
  REDIRECT = 'ROUTE_ACTIONS.REDIRECT',
  SET_IS_LOADING = 'ROUTE_ACTIONS.SET_IS_LOADING',
  SET_IS_LOGGED_IN = 'ROUTE_ACTIONS.SET_IS_LOGGED_IN',
}

type Redirect = {
  type: typeof ROUTE_ACTIONS.REDIRECT
  redirectTo: PATHS | null
}

type SetIsLoading = {
  type: typeof ROUTE_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type IsLoggedIn = {
  type: typeof ROUTE_ACTIONS.SET_IS_LOGGED_IN
  isLoggedIn: boolean
}

export type ActionTypes = Redirect | SetIsLoading | IsLoggedIn
