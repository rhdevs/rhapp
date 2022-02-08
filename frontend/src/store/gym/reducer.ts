import { Reducer } from 'redux'
import { ActionTypes, GYM_ACTIONS, GymStatus, HistoryEntry } from './types'

const initialState = {
  gymStatus: {
    keyStatus: '5-409',
    gymStatus: false,
  },
  gymHistory: [],
}

type State = {
  gymStatus: GymStatus
  gymHistory: HistoryEntry[]
}

export const gym: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case GYM_ACTIONS.GET_GYM_STATUS: {
      return { ...state, gymStatus: action.gymStatus }
    }
    case GYM_ACTIONS.GET_GYM_HISTORY: {
      return { ...state, gymHistory: action.history }
    }
    default:
      return state
  }
}
