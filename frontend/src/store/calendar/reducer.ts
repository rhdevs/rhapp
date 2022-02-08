import { Reducer } from 'redux'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

const initialState = {
  isClicked: false,
}

type State = {
  isClicked: boolean
}

export const calendar: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case CALENDAR_ACTIONS.SET_IS_CLICKED: {
      return {
        ...state,
        isClicked: action.newIsClicked,
      }
    }
  }
}
