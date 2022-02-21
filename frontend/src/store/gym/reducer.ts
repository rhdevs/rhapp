import { Reducer } from 'redux'
import { ActionTypes, GYM_ACTIONS, GymStatusStates, HistoryEntry } from './types'

const initialState = {
  gymStatus: {
    gymIsOpen: true,
    avatar: '',
    keyHolder: { displayName: 'Abby Tan', telegramHandle: 'oopsidonthave' },
    keyIsReturned: false,
  },
  gymHistory: [],
}

type State = {
  gymStatus: GymStatusStates
  gymHistory: HistoryEntry[]
}

export const gym: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case GYM_ACTIONS.GET_GYM_STATUS: {
      return { ...state, gymStatus: { ...state.gymStatus, ...action.gymStatus } }
    }
    case GYM_ACTIONS.GET_GYM_HISTORY: {
      return { ...state, gymHistory: action.history }
    }
    case GYM_ACTIONS.MOVE_KEY: {
      return {
        ...state,
        gymStatus: {
          ...state.gymStatus,
          keyHolder: { displayName: action.keyArgs.name, telegramHandle: action.keyArgs.telegram },
        },
      }
    }
    case GYM_ACTIONS.RETURN_KEY: {
      return {
        ...state,
        gymStatus: {
          ...state.gymStatus,
          keyHolder: { displayName: action.keyArgs.name, telegramHandle: action.keyArgs.telegram },
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
    case GYM_ACTIONS.GET_PROFILE_PIC: {
      return {
        ...state,
        gymStatus: { ...state.gymStatus, avatar: action.pic },
      }
    }
    default:
      return state
  }
}
