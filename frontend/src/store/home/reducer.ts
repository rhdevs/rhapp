import { Reducer } from 'redux'
import { ActionTypes, HOME_PAGE_ACTIONS, Account } from './types'

const initialState = {
  Account: null,
}

type State = {
  Account: Account | null
}

export const home: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case HOME_PAGE_ACTIONS.SET_ACCOUNT: {
      return {
        ...state,
        account: action.account,
      }
    }

    default:
      return state
  }
}
