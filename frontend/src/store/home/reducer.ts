import { Reducer } from 'redux'
import { ActionTypes, HOME_PAGE_ACTIONS, Account } from './types'
import { SearchResult } from './types'

const initialState = {
  Account: null,
  sampleStateText: 'Hola',
  searchResults: [],
}

type State = {
  Account: Account | null
  sampleStateText: string
  searchResults: SearchResult[]
}

export const home: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case HOME_PAGE_ACTIONS.SET_ACCOUNT: {
      return {
        ...state,
        account: action.account,
      }
    }

    case HOME_PAGE_ACTIONS.SAMPLE_TEXT: {
      return {
        ...state,
        sampleStateText: action.sampleStateText,
      }
    }
    case HOME_PAGE_ACTIONS.SEARCH: {
      return {
        ...state,
        searchResults: action.searchResults,
      }
    }
    default:
      return state
  }
}
