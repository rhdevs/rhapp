import { Reducer } from 'redux'
import { ActionTypes, CAT_ACTIONS } from './types'

const initialState = {
  catCount: 3,
  displayCatNumber: 0,
  isCatCountSingular: false,
}

type State = {
  catCount: number
  displayCatNumber: number
  isCatCountSingular: boolean
}

export const cat: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case CAT_ACTIONS.SET_CAT_COUNT: {
      return {
        ...state,
        catCount: action.catCount,
      }
    }
    case CAT_ACTIONS.SET_DISPLAY_CAT_NUMBER: {
      return {
        ...state,
        displayCatNumber: action.displayCatNumber,
      }
    }
    case CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR: {
      return {
        ...state,
        isCatCountSingular: action.isCatCountSingular,
      }
    }
    default:
      return state
  }
}
