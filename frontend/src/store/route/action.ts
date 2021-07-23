import { Dispatch } from '../types'
import { ActionTypes, ROUTE_ACTIONS } from './types'
import { PATHS } from '../../routes/Routes'

export const redirect = (redirectTo: PATHS) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: ROUTE_ACTIONS.REDIRECT,
    redirectTo,
  })
}

export const setIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: ROUTE_ACTIONS.SET_IS_LOADING,
    isLoading: desiredState,
  })
}

export const setIsLoggedIn = (isLoggedIn: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: ROUTE_ACTIONS.SET_IS_LOGGED_IN,
    isLoggedIn: isLoggedIn,
  })
}
