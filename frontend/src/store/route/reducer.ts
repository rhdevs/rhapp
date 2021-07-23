import { Reducer } from 'redux'
import { ActionTypes, ROUTE_ACTIONS } from './types'
import { PATHS } from '../../routes/Routes'

const initialState = {
  redirectTo: null,
  isLoading: false,
  isLoggedIn: false,
}

type State = {
  redirectTo: PATHS | null
  isLoading: boolean
  isLoggedIn: boolean
}

export const route: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case ROUTE_ACTIONS.REDIRECT: {
      return { ...state, redirectTo: action.redirectTo }
    }
    case ROUTE_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case ROUTE_ACTIONS.SET_IS_LOGGED_IN: {
      return { ...state, isLoggedIn: action.isLoggedIn }
    }
    default:
      return state
  }
}
