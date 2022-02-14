import { Reducer } from 'redux'
import { ActionTypes, GYM_ACTIONS, GymStatus, HistoryEntry } from './types'
import { gymStatus } from '../stubs'

const initialState = {
  gymStatus: {
    gymIsOpen: true,
    keyHolder: { displayName: 'Abby Tan', telegramHandle: 'oopsidonthave' },
    keyIsReturned: false,
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
    case GYM_ACTIONS.MOVE_KEY: {
      return {
        ...state,
        gymStatus: {
          ...state.gymStatus,
          keyHolder: { ...state.gymStatus.keyHolder, displayName: action.keyArgs.userID },
        },
      }
    }
    case GYM_ACTIONS.RETURN_KEY: {
      return {
        ...state,
        gymStatus: {
          ...state.gymStatus,
          keyHolder: { ...gymStatus.keyHolder },
          keyIsReturned: true,
        },
      }
    }
    case GYM_ACTIONS.TOGGLE_GYM: {
      return {
        ...state,
        gymStatus: { ...state.gymStatus, gymIsOpen: !state.gymStatus.gymIsOpen },
      }
    }
    default:
      return state
  }
}
