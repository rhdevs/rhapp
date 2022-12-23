import { Reducer } from 'redux'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

// TODO remove store
const initialState = {
  clickedDate: new Date(),
}

type State = {
  clickedDate: Date
}

export const calendar: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case CALENDAR_ACTIONS.SET_CLICKED_DATE: {
      return {
        ...state,
        clickedDate: action.newClickedDate,
      }
    }
    default:
      return state
  }
}
