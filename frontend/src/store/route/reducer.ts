import { Reducer } from 'redux'
import { ActionTypes, ROUTE_ACTIONS } from './types'
import { PATHS } from '../../routes/Routes'

const initialState = {
  redirectTo: null,
}

type State = {
  redirectTo: PATHS | null
}

export const route: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case ROUTE_ACTIONS.REDIRECT: {
      return {
        ...state,
        redirectTo: action.redirectTo,
      }
    }

    default:
      return state
  }
}
